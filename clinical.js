const round = (value, decimals = 2) => {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const cap = (value, maximum) => Math.min(value, maximum);

export function normalizeWeight(value) {
  const weight = Number(value);
  if (!Number.isFinite(weight) || weight < 0.5 || weight > 200) {
    return null;
  }
  return round(weight, 1);
}

export function calculatePals(weightInput) {
  const weight = normalizeWeight(weightInput);
  if (weight === null) {
    throw new RangeError("El peso debe estar entre 0.5 y 200 kg.");
  }

  const epinephrineMg = round(cap(0.01 * weight, 1));
  const atropineMg = round(cap(Math.max(0.02 * weight, 0.1), 0.5));

  return Object.freeze({
    weight,
    arrest: Object.freeze({
      epinephrineMg,
      epinephrineVolumeMlAtPointOne: round(epinephrineMg / 0.1, 1),
      amiodaroneFirstMg: round(cap(5 * weight, 300), 1),
      amiodaroneSubsequentMg: round(cap(5 * weight, 150), 1),
      lidocaineMg: round(weight, 1),
      defibrillationFirstJ: round(2 * weight, 1),
      defibrillationSecondJ: round(4 * weight, 1),
      defibrillationSubsequentMinJ: round(4 * weight, 1),
      defibrillationSubsequentMaxJ: round(10 * weight, 1),
    }),
    bradycardia: Object.freeze({
      epinephrineMg,
      epinephrineVolumeMlAtPointOne: round(epinephrineMg / 0.1, 1),
      atropineMg,
    }),
    tachyarrhythmia: Object.freeze({
      adenosineFirstMg: round(cap(0.1 * weight, 6), 1),
      adenosineSecondMg: round(cap(0.2 * weight, 12), 1),
      cardioversionInitialLowJ: round(0.5 * weight, 1),
      cardioversionInitialHighJ: round(weight, 1),
      cardioversionSecondJ: round(2 * weight, 1),
    }),
  });
}

export function formatNumber(value) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function getCycle(totalSeconds) {
  return Math.floor(Math.max(0, Number(totalSeconds) || 0) / 120) + 1;
}

export function getEpinephrineWindow(totalSeconds, lastDoseSecond) {
  if (!Number.isFinite(lastDoseSecond)) {
    return Object.freeze({ state: "unregistered", elapsed: null, message: "Registra la primera epinefrina para iniciar el intervalo de 3–5 min." });
  }

  const elapsed = Math.max(0, Math.floor(totalSeconds - lastDoseSecond));
  if (elapsed < 180) {
    return Object.freeze({ state: "early", elapsed, message: `Siguiente ventana en ${formatDuration(180 - elapsed)}.` });
  }
  if (elapsed <= 300) {
    return Object.freeze({ state: "due", elapsed, message: `Ventana de 3–5 min abierta (${formatDuration(elapsed)} desde la última dosis).` });
  }
  return Object.freeze({ state: "overdue", elapsed, message: `Han pasado ${formatDuration(elapsed)} desde la última dosis. Verifica el registro y el contexto clínico.` });
}
