import { ALGORITHMS, APP_INFO, SCENARIOS, SOURCES } from "./data.js";
import {
  calculatePals,
  formatDuration,
  formatNumber,
  getCycle,
  getEpinephrineWindow,
  normalizeWeight,
} from "./clinical.js";

const STORAGE_KEY = "eduvesa-pals-2025-simulation-v1";
const PAGE_TITLES = Object.freeze({
  inicio: "Panel clínico educativo",
  algoritmos: "Algoritmos resumidos",
  calculadora: "Calculadora por peso",
  simulacion: "Simulador y registro",
  referencias: "Fuentes y gobernanza",
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let activeAlgorithmId = ALGORITHMS[0].id;
let installPrompt = null;
let timerInterval = null;
let toastTimeout = null;
let clearSessionArmed = false;

const defaultSimulation = () => ({
  scenarioId: SCENARIOS[0].id,
  weight: SCENARIOS[0].weight,
  elapsed: 0,
  running: false,
  startedAt: null,
  events: [],
  notes: "",
});

const loadSimulation = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const validScenario = SCENARIOS.some((scenario) => scenario.id === saved?.scenarioId);
    return {
      ...defaultSimulation(),
      ...(saved && typeof saved === "object" ? saved : {}),
      scenarioId: validScenario ? saved.scenarioId : SCENARIOS[0].id,
      running: false,
      startedAt: null,
      events: Array.isArray(saved?.events) ? saved.events : [],
    };
  } catch {
    return defaultSimulation();
  }
};

const simulation = loadSimulation();

function saveSimulation() {
  const serializable = { ...simulation, running: false, startedAt: null };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch {
    // La aplicación sigue operativa si el navegador bloquea el almacenamiento local.
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function formatReviewDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function showView(viewName, { focus = true } = {}) {
  if (!PAGE_TITLES[viewName]) return;

  $$('[data-view-panel]').forEach((panel) => {
    const isActive = panel.dataset.viewPanel === viewName;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });

  $$(".nav-item").forEach((button) => {
    const isActive = button.dataset.view === viewName;
    button.classList.toggle("is-active", isActive);
    if (isActive) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  $("#page-title").textContent = PAGE_TITLES[viewName];
  document.body.classList.remove("menu-open");
  $("#menu-button").setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (focus) $("#main-content").focus({ preventScroll: true });
}

function setActiveAlgorithm(id) {
  if (!ALGORITHMS.some((algorithm) => algorithm.id === id)) return;
  activeAlgorithmId = id;
  $("#algorithm-search").value = "";
  renderAlgorithms();
}

function renderAlgorithmTabs() {
  const tabs = $("#algorithm-tabs");
  tabs.innerHTML = ALGORITHMS.map((algorithm) => `
    <button
      id="tab-${algorithm.id}"
      type="button"
      role="tab"
      aria-selected="${algorithm.id === activeAlgorithmId}"
      aria-controls="algorithm-content"
      data-algorithm-tab="${algorithm.id}"
    >${algorithm.label}</button>
  `).join("");
}

function includesQuery(algorithm, query) {
  if (!query) return true;
  const searchable = [
    algorithm.title,
    algorithm.subtitle,
    algorithm.caution,
    ...algorithm.details,
    ...algorithm.sections.flatMap((section) => [
      section.title,
      ...section.steps.flatMap((step) => [step.title, step.detail]),
    ]),
  ].join(" ").toLocaleLowerCase("es");
  return searchable.includes(query.toLocaleLowerCase("es"));
}

function renderAlgorithms() {
  renderAlgorithmTabs();
  const query = $("#algorithm-search")?.value.trim() ?? "";
  let algorithm = ALGORITHMS.find((item) => item.id === activeAlgorithmId);

  if (query && !includesQuery(algorithm, query)) {
    algorithm = ALGORITHMS.find((item) => includesQuery(item, query));
  }

  const content = $("#algorithm-content");
  if (!algorithm) {
    content.innerHTML = `
      <div class="search-empty">
        <h3>Sin coincidencias</h3>
        <p>Prueba con ritmo, epinefrina, descarga, cardioversión, ventilación o temperatura.</p>
      </div>`;
    return;
  }

  if (query && algorithm.id !== activeAlgorithmId) {
    activeAlgorithmId = algorithm.id;
    renderAlgorithmTabs();
  }

  const source = SOURCES[algorithm.sourceIndex];
  content.innerHTML = `
    <div class="algorithm-main">
      <article class="algorithm-card">
        <p class="kicker">${algorithm.label}</p>
        <h2>${algorithm.title}</h2>
        <p class="section-copy">${algorithm.subtitle}</p>
      </article>
      ${algorithm.sections.map((section) => `
        <article class="algorithm-card">
          <h3>${section.title}</h3>
          <ol class="step-list">
            ${section.steps.map((step) => `
              <li><strong>${step.title}</strong><span>${step.detail}</span></li>
            `).join("")}
          </ol>
        </article>
      `).join("")}
    </div>
    <aside class="algorithm-aside">
      <article class="algorithm-card">
        <p class="kicker">Dosis y detalles</p>
        <ul class="detail-list">
          ${algorithm.details.map((detail) => `<li>${detail}</li>`).join("")}
        </ul>
      </article>
      <article class="algorithm-card caution-card">
        <p class="kicker">Punto de seguridad</p>
        <strong>${algorithm.caution}</strong>
      </article>
      <article class="algorithm-card source-inline">
        <strong>Fuente primaria</strong>
        <p>${source.title}</p>
        <a href="${source.url}" target="_blank" rel="noopener noreferrer">Abrir documento oficial ↗</a>
      </article>
    </aside>
  `;
}

function resultItem(label, value, detail) {
  return `
    <div class="result-item">
      <span>${label}</span>
      <strong>${value}</strong>
      <small>${detail}</small>
    </div>`;
}

function renderCalculator(calculation) {
  const f = formatNumber;
  const { arrest, bradycardia, tachyarrhythmia, weight } = calculation;
  $("#calculator-results").innerHTML = `
    <div class="result-summary">
      <div><strong>${f(weight)} kg</strong><br><span>Resultado teórico por peso</span></div>
      <span>Verifica antes de usar</span>
    </div>
    <section class="result-group">
      <p class="kicker">Paro cardiaco</p>
      <h3>Fármacos</h3>
      <div class="result-grid">
        ${resultItem("Epinefrina IV/IO", `${f(arrest.epinephrineMg)} mg`, `${f(arrest.epinephrineVolumeMlAtPointOne)} mL de 0.1 mg/mL · máx. 1 mg`)}
        ${resultItem("Amiodarona, primera dosis", `${f(arrest.amiodaroneFirstMg)} mg`, "5 mg/kg · máx. 300 mg")}
        ${resultItem("Amiodarona, dosis posteriores", `${f(arrest.amiodaroneSubsequentMg)} mg`, "5 mg/kg · máx. 150 mg por dosis posterior")}
        ${resultItem("Lidocaína IV/IO", `${f(arrest.lidocaineMg)} mg`, "1 mg/kg · alternativa a amiodarona")}
      </div>
    </section>
    <section class="result-group">
      <p class="kicker">Paro cardiaco</p>
      <h3>Desfibrilación</h3>
      <div class="result-grid">
        ${resultItem("Primera descarga", `${f(arrest.defibrillationFirstJ)} J`, "2 J/kg")}
        ${resultItem("Segunda descarga", `${f(arrest.defibrillationSecondJ)} J`, "4 J/kg")}
        ${resultItem("Descargas posteriores", `${f(arrest.defibrillationSubsequentMinJ)}–${f(arrest.defibrillationSubsequentMaxJ)} J`, "≥4 hasta 10 J/kg; no exceder dosis adulta")}
      </div>
    </section>
    <section class="result-group">
      <p class="kicker">Bradicardia con pulso</p>
      <h3>Fármacos</h3>
      <div class="result-grid">
        ${resultItem("Epinefrina IV/IO", `${f(bradycardia.epinephrineMg)} mg`, `${f(bradycardia.epinephrineVolumeMlAtPointOne)} mL de 0.1 mg/mL · máx. 1 mg`)}
        ${resultItem("Atropina IV/IO", `${f(bradycardia.atropineMg)} mg`, "0.02 mg/kg · mín. 0.1 mg · máx. 0.5 mg por dosis")}
      </div>
    </section>
    <section class="result-group">
      <p class="kicker">Taquiarritmia con pulso</p>
      <h3>Adenosina y cardioversión</h3>
      <div class="result-grid">
        ${resultItem("Adenosina, primera dosis", `${f(tachyarrhythmia.adenosineFirstMg)} mg`, "0.1 mg/kg · máx. 6 mg · bolo rápido + lavado")}
        ${resultItem("Adenosina, segunda dosis", `${f(tachyarrhythmia.adenosineSecondMg)} mg`, "0.2 mg/kg · máx. 12 mg · bolo rápido + lavado")}
        ${resultItem("Cardioversión inicial", `${f(tachyarrhythmia.cardioversionInitialLowJ)}–${f(tachyarrhythmia.cardioversionInitialHighJ)} J`, "0.5–1 J/kg sincronizada")}
        ${resultItem("Cardioversión si persiste", `${f(tachyarrhythmia.cardioversionSecondJ)} J`, "2 J/kg sincronizada")}
      </div>
    </section>
  `;
}

function clearCalculator() {
  $("#weight").value = "";
  $("#weight-error").textContent = "";
  $("#calculator-results").innerHTML = `
    <div class="empty-state">
      <span aria-hidden="true">∑</span>
      <h3>Introduce el peso</h3>
      <p>Los resultados aparecerán organizados por paro, bradicardia y taquiarritmia.</p>
    </div>`;
}

function currentScenario() {
  return SCENARIOS.find((scenario) => scenario.id === simulation.scenarioId) ?? SCENARIOS[0];
}

function renderScenario() {
  const scenario = currentScenario();
  $("#scenario-select").value = scenario.id;
  $("#simulation-weight").value = simulation.weight;
  $("#scenario-brief").innerHTML = `
    <p>${scenario.brief}</p>
    <p><strong>Objetivo:</strong> ${scenario.objective}</p>`;
}

function getLastEpinephrineSecond() {
  const dose = [...simulation.events].reverse().find((event) => event.label === "Epinefrina");
  return dose ? dose.second : Number.NaN;
}

function renderTimer() {
  $("#timer-display").textContent = formatDuration(simulation.elapsed);
  $("#cycle-display").textContent = `Ciclo ${getCycle(simulation.elapsed)}`;
  $("#timer-toggle").textContent = simulation.running ? "Pausar" : simulation.elapsed > 0 ? "Continuar" : "Iniciar";

  const epi = getEpinephrineWindow(simulation.elapsed, getLastEpinephrineSecond());
  const windowElement = $("#epi-window");
  windowElement.textContent = epi.message;
  windowElement.classList.toggle("is-due", epi.state === "due" || epi.state === "overdue");
}

function renderEvents() {
  const log = $("#event-log");
  if (!simulation.events.length) {
    log.innerHTML = '<li class="event-log__empty">Aún no hay intervenciones registradas.</li>';
    return;
  }
  log.innerHTML = simulation.events.map((event) => `
    <li><time datetime="PT${event.second}S">${formatDuration(event.second)}</time><span>${event.label}</span></li>
  `).join("");
  log.scrollTop = log.scrollHeight;
}

function updateElapsed() {
  if (!simulation.running || !simulation.startedAt) return;
  simulation.elapsed = Math.max(0, Math.floor((Date.now() - simulation.startedAt) / 1000));
  renderTimer();
  if (simulation.elapsed % 5 === 0) saveSimulation();
}

function startTimer() {
  simulation.running = true;
  simulation.startedAt = Date.now() - simulation.elapsed * 1000;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateElapsed, 250);
  renderTimer();
}

function pauseTimer() {
  updateElapsed();
  simulation.running = false;
  simulation.startedAt = null;
  clearInterval(timerInterval);
  timerInterval = null;
  saveSimulation();
  renderTimer();
}

function resetTimer() {
  pauseTimer();
  simulation.elapsed = 0;
  simulation.events = [];
  saveSimulation();
  renderTimer();
  renderEvents();
}

function recordEvent(label) {
  simulation.events.push({ label, second: simulation.elapsed });
  if (label === "ROSC" && simulation.running) pauseTimer();
  saveSimulation();
  renderEvents();
  renderTimer();
}

function setScenario(scenarioId) {
  const scenario = SCENARIOS.find((item) => item.id === scenarioId);
  if (!scenario) return;
  if (simulation.running) pauseTimer();
  Object.assign(simulation, {
    scenarioId: scenario.id,
    weight: scenario.weight,
    elapsed: 0,
    events: [],
    notes: "",
  });
  $("#simulation-notes").value = "";
  saveSimulation();
  renderScenario();
  renderTimer();
  renderEvents();
}

function resetSession() {
  if (!clearSessionArmed) {
    clearSessionArmed = true;
    $("#new-session").textContent = "Confirmar borrado";
    showToast("Pulsa nuevamente para borrar la sesión local.");
    setTimeout(() => {
      clearSessionArmed = false;
      $("#new-session").textContent = "Nueva sesión";
    }, 5000);
    return;
  }

  pauseTimer();
  Object.assign(simulation, defaultSimulation());
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin almacenamiento disponible no hay datos persistentes que eliminar.
  }
  clearSessionArmed = false;
  $("#new-session").textContent = "Nueva sesión";
  $("#simulation-notes").value = "";
  renderScenario();
  renderTimer();
  renderEvents();
  showToast("Sesión local eliminada.");
}

function buildSessionMarkdown() {
  const scenario = currentScenario();
  const events = simulation.events.length
    ? simulation.events.map((event) => `- ${formatDuration(event.second)} — ${event.label}`).join("\n")
    : "- Sin eventos registrados";

  return `# Registro de simulación PALS 2025

**Escenario:** ${scenario.title}  
**Peso simulado:** ${simulation.weight || "—"} kg  
**Duración:** ${formatDuration(simulation.elapsed)}  
**Fecha:** ${new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" }).format(new Date())}

## Objetivo
${scenario.objective}

## Eventos
${events}

## Notas
${simulation.notes.trim() || "—"}

## Debriefing
- ¿Qué observó el equipo y qué decisiones tomó?
- ¿Qué favoreció o dificultó la RCP de alta calidad?
- ¿El tratamiento correspondió al ritmo y al momento?
- ¿Qué cambio concreto aplicará el equipo en el próximo caso?

> Registro educativo generado por Guía PALS 2025, versión ${APP_INFO.version}. No es parte del expediente clínico ni sustituye documentación institucional.`;
}

function downloadText(content, filename, mime = "text/markdown;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copyText(content) {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function renderSources() {
  $("#source-list").innerHTML = SOURCES.map((source) => `
    <a class="source-card" href="${source.url}" target="_blank" rel="noopener noreferrer">
      <span class="source-card__icon" aria-hidden="true">↗</span>
      <span><strong>${source.title}</strong><small>${source.organization} · ${source.type}</small></span>
      <span class="source-card__arrow" aria-hidden="true">→</span>
    </a>
  `).join("");
}

function updateConnectionStatus() {
  const status = $("#connection-status");
  const online = navigator.onLine;
  status.textContent = online ? "En línea" : "Sin conexión · PWA activa";
  status.classList.toggle("is-offline", !online);
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    $("#install-button").hidden = false;
  });

  $("#install-button").addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    $("#install-button").hidden = true;
  });

  window.addEventListener("appinstalled", () => showToast("Aplicación instalada."));
}

function setupServiceWorker() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  navigator.serviceWorker.register("./sw.js").then((registration) => {
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state === "installed" && navigator.serviceWorker.controller) {
          $("#update-banner").hidden = false;
        }
      });
    });

    $("#update-button").addEventListener("click", () => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
  }).catch(() => {
    showToast("No se pudo activar el modo sin conexión en este navegador.");
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
}

function bindEvents() {
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });

  $$('[data-go]').forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.go));
  });

  $$('[data-algorithm]').forEach((button) => {
    button.addEventListener("click", () => {
      setActiveAlgorithm(button.dataset.algorithm);
      showView("algoritmos");
    });
  });

  $("#algorithm-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-algorithm-tab]");
    if (button) setActiveAlgorithm(button.dataset.algorithmTab);
  });

  $("#algorithm-search").addEventListener("input", renderAlgorithms);

  $("#calculator-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const weight = normalizeWeight($("#weight").value);
    if (weight === null) {
      $("#weight-error").textContent = "Introduce un peso entre 0.5 y 200 kg.";
      return;
    }
    $("#weight-error").textContent = "";
    renderCalculator(calculatePals(weight));
  });

  $$("[data-weight]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#weight").value = button.dataset.weight;
      $("#calculator-form").requestSubmit();
    });
  });
  $("#clear-calculator").addEventListener("click", clearCalculator);

  $("#scenario-select").addEventListener("change", (event) => setScenario(event.target.value));
  $("#simulation-weight").addEventListener("change", (event) => {
    const weight = normalizeWeight(event.target.value);
    if (weight === null) {
      event.target.value = simulation.weight;
      showToast("El peso de simulación debe estar entre 0.5 y 200 kg.");
      return;
    }
    simulation.weight = weight;
    saveSimulation();
  });

  $("#timer-toggle").addEventListener("click", () => {
    if (simulation.running) pauseTimer();
    else startTimer();
  });
  $("#timer-reset").addEventListener("click", resetTimer);

  $("#event-actions").addEventListener("click", (event) => {
    const button = event.target.closest("[data-event]");
    if (button) recordEvent(button.dataset.event);
  });

  $("#undo-event").addEventListener("click", () => {
    if (!simulation.events.length) return;
    simulation.events.pop();
    saveSimulation();
    renderEvents();
    renderTimer();
  });

  $("#simulation-notes").addEventListener("input", (event) => {
    simulation.notes = event.target.value;
    saveSimulation();
  });

  $("#copy-session").addEventListener("click", async () => {
    const copied = await copyText(buildSessionMarkdown());
    showToast(copied ? "Resumen copiado." : "No se pudo copiar el resumen.");
  });

  $("#download-session").addEventListener("click", () => {
    downloadText(buildSessionMarkdown(), `simulacion-pals-${new Date().toISOString().slice(0, 10)}.md`);
  });

  $("#new-session").addEventListener("click", resetSession);

  $("#menu-button").addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    $("#menu-button").setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.classList.remove("menu-open");
      $("#menu-button").setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  window.addEventListener("beforeunload", pauseTimer);
}

function init() {
  const reviewDate = formatReviewDate(APP_INFO.reviewedAt);
  $("#review-date").textContent = reviewDate;
  $("#review-date-full").textContent = reviewDate;
  $("#app-version").textContent = APP_INFO.version;
  $("#scenario-select").innerHTML = SCENARIOS.map((scenario) => `<option value="${scenario.id}">${scenario.title}</option>`).join("");
  $("#simulation-notes").value = simulation.notes;
  renderAlgorithms();
  renderSources();
  renderScenario();
  renderTimer();
  renderEvents();
  updateConnectionStatus();
  bindEvents();
  setupInstallPrompt();
  setupServiceWorker();
  const requestedView = new URLSearchParams(location.search).get("view");
  if (requestedView && PAGE_TITLES[requestedView]) showView(requestedView, { focus: false });
}

init();
