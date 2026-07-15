export const APP_INFO = Object.freeze({
  name: "Guía PALS 2025",
  version: "1.0.0",
  reviewedAt: "2026-07-14",
  guidelineEdition: "AHA/AAP 2025",
});

export const SOURCES = Object.freeze([
  {
    title: "Pediatric Advanced Life Support: 2025 Guidelines",
    organization: "American Heart Association / American Academy of Pediatrics",
    type: "Guía científica",
    url: "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001368",
  },
  {
    title: "Pediatric Cardiac Arrest Algorithm",
    organization: "American Heart Association / American Academy of Pediatrics",
    type: "Algoritmo oficial 2025",
    url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf?sc_lang=en",
  },
  {
    title: "Pediatric Bradycardia With a Pulse Algorithm",
    organization: "American Heart Association / American Academy of Pediatrics",
    type: "Algoritmo oficial 2025",
    url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Bradycardia-250121.pdf?sc_lang=en",
  },
  {
    title: "Pediatric Tachyarrhythmia With a Pulse Algorithm",
    organization: "American Heart Association / American Academy of Pediatrics",
    type: "Algoritmo oficial 2025",
    url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf?sc_lang=en",
  },
  {
    title: "Components of Post–Cardiac Arrest Care",
    organization: "American Heart Association / American Academy of Pediatrics",
    type: "Lista de verificación 2025",
    url: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Checklist-PALS-PCAC-250213.pdf",
  },
  {
    title: "2025 CPR & ECC Algorithms",
    organization: "American Heart Association",
    type: "Índice oficial",
    url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/algorithms",
  },
]);

export const ALGORITHMS = Object.freeze([
  {
    id: "cardiac-arrest",
    label: "Paro cardiaco",
    title: "Paro cardiaco pediátrico",
    subtitle: "Distingue el ritmo, prioriza RCP de alta calidad y trata causas reversibles.",
    sourceIndex: 1,
    sections: [
      {
        title: "Inicio común",
        steps: [
          { title: "Inicia RCP", detail: "Ventila con bolsa-mascarilla y oxígeno; conecta monitor/desfibrilador." },
          { title: "Identifica el ritmo", detail: "Separa FV/TV sin pulso de asistolia/AESP." },
          { title: "Trabaja en ciclos de 2 minutos", detail: "Reevalúa el ritmo con interrupciones mínimas." },
        ],
      },
      {
        title: "FV o TV sin pulso",
        steps: [
          { title: "Primera descarga: 2 J/kg", detail: "Reanuda RCP inmediatamente durante 2 minutos y obtiene acceso IV/IO." },
          { title: "Segunda descarga: 4 J/kg", detail: "RCP 2 minutos; epinefrina cada 3–5 minutos; considera vía aérea avanzada y capnografía." },
          { title: "Descargas posteriores: ≥4 J/kg", detail: "Sin exceder 10 J/kg o la dosis adulta. Durante RCP considera amiodarona o lidocaína y trata causas reversibles." },
        ],
      },
      {
        title: "Asistolia o AESP",
        steps: [
          { title: "Epinefrina lo antes posible", detail: "0.01 mg/kg IV/IO de la concentración 0.1 mg/mL; máximo 1 mg." },
          { title: "RCP 2 minutos", detail: "Acceso IV/IO, epinefrina cada 3–5 minutos; considera vía aérea avanzada y capnografía." },
          { title: "Busca causas reversibles", detail: "Corrige las H y T mientras continúa la reanimación." },
        ],
      },
    ],
    details: [
      "Compresiones: 100–120/min, profundidad ≥1/3 del diámetro anteroposterior y retroceso completo.",
      "Sin vía aérea avanzada: 15:2 con 2 reanimadores antes de la pubertad; 30:2 con 1 reanimador a cualquier edad o con 2 reanimadores después del inicio de la pubertad.",
      "Con vía aérea avanzada: compresiones continuas y 1 ventilación cada 2–3 segundos.",
      "Amiodarona: 5 mg/kg (máximo 300 mg); puede repetirse hasta 3 dosis, con máximo de 150 mg en dosis posteriores.",
      "Lidocaína: 1 mg/kg IV/IO como alternativa a amiodarona.",
    ],
    caution: "La descarga se administra tan pronto como sea posible; no retrases la RCP por preparar fármacos o una vía aérea avanzada.",
  },
  {
    id: "bradycardia",
    label: "Bradicardia",
    title: "Bradicardia con pulso",
    subtitle: "Determina si existe compromiso cardiopulmonar y corrige primero ventilación y oxigenación.",
    sourceIndex: 2,
    sections: [
      {
        title: "Evaluación y apoyo",
        steps: [
          { title: "Busca compromiso cardiopulmonar", detail: "Alteración aguda del estado mental, signos de choque o hipotensión." },
          { title: "Apoya vía aérea y respiración", detail: "Mantén vía aérea permeable, proporciona oxígeno y ventilación a presión positiva cuando sea necesaria." },
          { title: "Monitoriza", detail: "Conecta monitor cardiorrespiratorio y vigila el pulso." },
        ],
      },
      {
        title: "Si persiste con compromiso",
        steps: [
          { title: "Inicia RCP si FC <60/min", detail: "Tras apoyo de oxigenación y ventilación, cuando continúa la mala perfusión." },
          { title: "Obtén acceso IV/IO", detail: "Administra epinefrina y considera atropina si hay tono vagal aumentado o bloqueo AV primario." },
          { title: "Trata la causa", detail: "Considera estimulación transtorácica o transvenosa y revisa el pulso cada 2 minutos." },
        ],
      },
    ],
    details: [
      "Epinefrina IV/IO: 0.01 mg/kg (0.1 mg/mL), máximo 1 mg.",
      "Atropina IV/IO: 0.02 mg/kg; puede repetirse una vez; mínimo 0.1 mg y máximo por dosis 0.5 mg.",
      "Causas posibles: hipoxia, hipotermia, fármacos/tóxicos, presión intracraneal elevada, tono vagal, bloqueo cardiaco o respuesta fisiológica.",
    ],
    caution: "En pediatría, la hipoxia y la ventilación inadecuada son causas frecuentes de bradicardia; corrígelas de inmediato.",
  },
  {
    id: "tachyarrhythmia",
    label: "Taquiarritmia",
    title: "Taquiarritmia con pulso",
    subtitle: "Evalúa estabilidad, duración del QRS y probabilidad de taquicardia sinusal o supraventricular.",
    sourceIndex: 3,
    sections: [
      {
        title: "Evaluación inicial",
        steps: [
          { title: "Apoya ABC", detail: "Vía aérea permeable, ventilación y oxígeno según necesidad; monitor, IV/IO y ECG de 12 derivaciones si está disponible." },
          { title: "Diferencia el mecanismo", detail: "En TSV suelen faltar ondas P normales, el RR es fijo, el inicio es abrupto y la frecuencia suele ser ≥220/min en lactantes o ≥180/min en niños." },
          { title: "Busca compromiso", detail: "Alteración aguda del estado mental, signos de choque o hipotensión." },
        ],
      },
      {
        title: "Con compromiso cardiopulmonar",
        steps: [
          { title: "QRS estrecho", detail: "Si ya existe acceso IV/IO, administra adenosina o realiza cardioversión sincronizada." },
          { title: "QRS ancho", detail: "Cardioversión sincronizada; se aconseja consulta experta antes de fármacos adicionales." },
          { title: "Energía sincronizada", detail: "Inicia con 0.5–1 J/kg; si no es efectiva aumenta a 2 J/kg. Seda si es necesario, sin retrasar la cardioversión." },
        ],
      },
      {
        title: "Sin compromiso cardiopulmonar",
        steps: [
          { title: "QRS estrecho y probable TSV", detail: "Considera maniobras vagales y administra adenosina IV/IO." },
          { title: "QRS ancho", detail: "Si el ritmo es regular y monomórfico puede considerarse adenosina; solicita consulta experta." },
          { title: "Taquicardia sinusal", detail: "Busca y trata la causa; no la manejes como TSV solo por la frecuencia." },
        ],
      },
    ],
    details: [
      "QRS estrecho: ≤0.09 s; QRS ancho: >0.09 s.",
      "Adenosina 1.ª dosis: 0.1 mg/kg, máximo 6 mg, bolo rápido seguido de lavado IV.",
      "Adenosina 2.ª dosis: 0.2 mg/kg, máximo 12 mg, bolo rápido seguido de lavado IV.",
      "La frecuencia por sí sola no confirma TSV; integra ondas P, variabilidad RR e historia del inicio.",
    ],
    caution: "No retrases la cardioversión sincronizada de una taquiarritmia inestable por sedación, ECG de 12 derivaciones o consulta.",
  },
  {
    id: "post-rosc",
    label: "Posparo",
    title: "Cuidados después de ROSC",
    subtitle: "Previene lesión secundaria mediante objetivos de oxigenación, ventilación, perfusión, temperatura y neurología.",
    sourceIndex: 4,
    sections: [
      {
        title: "Oxigenación, ventilación y perfusión",
        steps: [
          { title: "Titula el oxígeno", detail: "Objetivo SpO₂ 94–98% o el valor normal/apropiado del niño." },
          { title: "Individualiza PaCO₂", detail: "Mide y busca un valor apropiado para la condición del paciente, evitando hiper o hipocapnia graves." },
          { title: "Optimiza perfusión", detail: "Mantén presión sistólica y media por encima del percentil 10 para edad y sexo; vigila lactato y diuresis." },
        ],
      },
      {
        title: "Temperatura y neurología",
        steps: [
          { title: "Monitoriza temperatura central", detail: "Previene y trata fiebre después del paro y tras el recalentamiento." },
          { title: "Aplica TTM si permanece en coma", detail: "32–34 °C seguido de 36–37.5 °C, o solo 36–37.5 °C, hasta por 5 días según protocolo." },
          { title: "Vigila el cerebro", detail: "EEG continuo si no está en su estado neurológico basal y hay recursos; trata convulsiones." },
        ],
      },
      {
        title: "Cuidados integrales",
        steps: [
          { title: "Glucosa y electrolitos", detail: "Mide glucosa, evita hipoglucemia y conserva electrolitos en rango normal." },
          { title: "Dolor, agitación y sedación", detail: "Trata con objetivos de sedación definidos." },
          { title: "Pronóstico multimodal", detail: "No depende de un solo predictor y se difiere al menos 72 horas después del paro." },
        ],
      },
    ],
    details: [
      "Telemetría continua, presión arterial y revisión diaria de metas hemodinámicas.",
      "Considera ecocardiografía para valorar disfunción miocárdica.",
      "El recalentamiento aumenta el riesgo de hipotensión, alteraciones electrolíticas, hipoglucemia y convulsiones.",
      "Prevén escalofríos durante el control dirigido de temperatura.",
    ],
    caution: "El percentil 10 de presión arterial depende de edad y sexo; usa una fuente institucional validada y no una tabla aproximada.",
  },
]);

export const SCENARIOS = Object.freeze([
  {
    id: "vf-adolescent",
    title: "FV/TV sin pulso en adolescente",
    weight: 50,
    algorithmId: "cardiac-arrest",
    brief: "Adolescente con colapso súbito durante actividad física. No responde, no respira normalmente y no tiene pulso; el monitor muestra fibrilación ventricular.",
    objective: "Desfibrilar con la energía correcta, mantener RCP de alta calidad y secuenciar epinefrina y antiarrítmico.",
  },
  {
    id: "pea-infant",
    title: "AESP después de hipoxemia en lactante",
    weight: 8,
    algorithmId: "cardiac-arrest",
    brief: "Lactante con deterioro respiratorio progresivo, bradicardia y posterior actividad eléctrica sin pulso.",
    objective: "Priorizar ventilación eficaz, epinefrina precoz y corrección de causas reversibles.",
  },
  {
    id: "vagal-bradycardia",
    title: "Bradicardia con compromiso en escolar",
    weight: 25,
    algorithmId: "bradycardia",
    brief: "Escolar con bradicardia persistente, hipotensión y mala perfusión después de un estímulo vagal durante un procedimiento.",
    objective: "Apoyar ABC, iniciar RCP si corresponde y decidir entre epinefrina, atropina y estimulación.",
  },
  {
    id: "svt-infant",
    title: "TSV estable que progresa a inestabilidad",
    weight: 6,
    algorithmId: "tachyarrhythmia",
    brief: "Lactante con frecuencia de 250/min, QRS estrecho, RR fijo y ondas P no identificables. Inicialmente alerta; después desarrolla signos de choque.",
    objective: "Reconocer TSV, usar adenosina correctamente y no retrasar cardioversión al aparecer compromiso.",
  },
]);
