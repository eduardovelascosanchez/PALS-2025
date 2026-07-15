import test from "node:test";
import assert from "node:assert/strict";
import {
  calculatePals,
  formatDuration,
  getCycle,
  getEpinephrineWindow,
  normalizeWeight,
} from "../assets/js/clinical.js";

test("calcula dosis y energía para 18 kg", () => {
  const result = calculatePals(18);
  assert.equal(result.arrest.epinephrineMg, 0.18);
  assert.equal(result.arrest.epinephrineVolumeMlAtPointOne, 1.8);
  assert.equal(result.arrest.amiodaroneFirstMg, 90);
  assert.equal(result.arrest.defibrillationFirstJ, 36);
  assert.equal(result.arrest.defibrillationSecondJ, 72);
  assert.equal(result.bradycardia.atropineMg, 0.36);
  assert.equal(result.tachyarrhythmia.adenosineFirstMg, 1.8);
  assert.equal(result.tachyarrhythmia.cardioversionInitialLowJ, 9);
});

test("aplica los máximos explícitos en un paciente de 100 kg", () => {
  const result = calculatePals(100);
  assert.equal(result.arrest.epinephrineMg, 1);
  assert.equal(result.arrest.amiodaroneFirstMg, 300);
  assert.equal(result.arrest.amiodaroneSubsequentMg, 150);
  assert.equal(result.bradycardia.atropineMg, 0.5);
  assert.equal(result.tachyarrhythmia.adenosineFirstMg, 6);
  assert.equal(result.tachyarrhythmia.adenosineSecondMg, 12);
});

test("respeta la dosis mínima de atropina", () => {
  assert.equal(calculatePals(0.5).bradycardia.atropineMg, 0.1);
});

test("rechaza pesos fuera del intervalo operativo", () => {
  assert.equal(normalizeWeight(0), null);
  assert.equal(normalizeWeight(201), null);
  assert.equal(normalizeWeight("no-numérico"), null);
  assert.throws(() => calculatePals(0), RangeError);
});

test("formatea cronómetro y ciclos de dos minutos", () => {
  assert.equal(formatDuration(0), "00:00");
  assert.equal(formatDuration(125), "02:05");
  assert.equal(getCycle(119), 1);
  assert.equal(getCycle(120), 2);
});

test("clasifica la ventana de epinefrina de 3 a 5 minutos", () => {
  assert.equal(getEpinephrineWindow(100, Number.NaN).state, "unregistered");
  assert.equal(getEpinephrineWindow(179, 0).state, "early");
  assert.equal(getEpinephrineWindow(180, 0).state, "due");
  assert.equal(getEpinephrineWindow(300, 0).state, "due");
  assert.equal(getEpinephrineWindow(301, 0).state, "overdue");
});
