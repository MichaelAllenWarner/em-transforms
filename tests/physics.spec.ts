import { test, expect } from '@playwright/test';
import { getCalculatedQuantities } from '../helpers/getCalculatedQuantities';
import type { CartesianComponents } from '../store/store';

// Default particle/charge/mass values used in most tests
const defaults = {
  particleVelocity: [0, 0, 0] as [number, number, number],
  particleCharge: 1,
  particleMass: 1,
};

const closeTo = (a: number[], b: number[], precision = 6) => {
  expect(a).toHaveLength(b.length);
  a.forEach((v, i) => expect(v).toBeCloseTo(b[i], precision));
};

// ─── Zero boost ──────────────────────────────────────────────────────────────

test('zero boost: primed fields equal unprimed', () => {
  const eField: CartesianComponents = [1, -1, 1];
  const bField: CartesianComponents = [-1, 1, -1];
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [0, 0, Math.PI / 2], // r=0
    eField,
    bField,
    ...defaults,
  });
  closeTo(ePrime, eField);
  closeTo(bPrime, bField);
});

// ─── Lorentz invariants ───────────────────────────────────────────────────────

test('E·B is a Lorentz invariant', () => {
  const eField: CartesianComponents = [2, 1, 0];
  const bField: CartesianComponents = [0, 1, -1];
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [0.6, 0, Math.PI / 2], // v=0.6 along +x
    eField,
    bField,
    ...defaults,
  });
  const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
  expect(dot(ePrime, bPrime)).toBeCloseTo(dot(eField, bField), 5);
});

test('E²−B² is a Lorentz invariant', () => {
  const eField: CartesianComponents = [2, 1, 0];
  const bField: CartesianComponents = [0, 1, -1];
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [0.6, 0, Math.PI / 2],
    eField,
    bField,
    ...defaults,
  });
  const norm2 = (v: number[]) => v.reduce((s, x) => s + x * x, 0);
  expect(norm2(ePrime) - norm2(bPrime)).toBeCloseTo(norm2(eField) - norm2(bField), 5);
});

// ─── Boost along x: analytic field transforms ────────────────────────────────
// For boost v̂=x̂: E'∥=E∥, E'⊥=γ(E⊥−v B⊥×x̂), B'∥=B∥, B'⊥=γ(B⊥+v x̂×E⊥)
// Explicitly: E'x=Ex, E'y=γ(Ey−vBz), E'z=γ(Ez+vBy)
//             B'x=Bx, B'y=γ(By+vEz), B'z=γ(Bz−vEy)

test('boost along x with E along y, zero B: analytic field transform', () => {
  const v = 0.6;
  const γ = 1 / Math.sqrt(1 - v * v);
  const Ey = 3;
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [v, 0, Math.PI / 2],
    eField: [0, Ey, 0],
    bField: [0, 0, 0],
    ...defaults,
  });
  closeTo(ePrime, [0, γ * Ey, 0]);
  closeTo(bPrime, [0, 0, -γ * v * Ey]);
});

test('boost along x with both E and B nonzero: cross-product terms correct', () => {
  const v = 0.6;
  const γ = 1 / Math.sqrt(1 - v * v);
  const Ey = 2, Bz = 1.5;
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [v, 0, Math.PI / 2],
    eField: [0, Ey, 0],
    bField: [0, 0, Bz],
    ...defaults,
  });
  // E'x=0, E'y=γ(Ey−v·Bz), E'z=0
  // B'x=0, B'y=0, B'z=γ(Bz−v·Ey)
  closeTo(ePrime, [0, γ * (Ey - v * Bz), 0]);
  closeTo(bPrime, [0, 0, γ * (Bz - v * Ey)]);
});

test('boost along x: parallel components unchanged', () => {
  const Ex = 5, Bx = -3;
  const { ePrime, bPrime } = getCalculatedQuantities({
    boostVelocity: [0.7, 0, Math.PI / 2],
    eField: [Ex, 0, 0],
    bField: [Bx, 0, 0],
    ...defaults,
  });
  expect(ePrime[0]).toBeCloseTo(Ex, 5);
  expect(bPrime[0]).toBeCloseTo(Bx, 5);
});

// ─── Velocity addition ────────────────────────────────────────────────────────

test('particle at rest transforms to -v in primed frame', () => {
  const v = 0.5;
  const { particleVelocityPrime } = getCalculatedQuantities({
    boostVelocity: [v, 0, Math.PI / 2], // boost along +x
    eField: [0, 0, 0],
    bField: [0, 0, 0],
    particleVelocity: [0, 0, Math.PI / 2], // r=0, at rest
    particleCharge: 1,
    particleMass: 1,
  });
  expect(particleVelocityPrime[0]).toBeCloseTo(-v, 5);
  expect(particleVelocityPrime[1]).toBeCloseTo(0, 5);
  expect(particleVelocityPrime[2]).toBeCloseTo(0, 5);
});

test('relativistic velocity addition along x', () => {
  const v = 0.6;   // boost speed
  const u = 0.5;   // particle speed in unprimed frame (along +x)
  const expected = (u - v) / (1 - u * v); // relativistic addition
  const { particleVelocityPrime } = getCalculatedQuantities({
    boostVelocity: [v, 0, Math.PI / 2],
    eField: [0, 0, 0],
    bField: [0, 0, 0],
    particleVelocity: [u, 0, Math.PI / 2], // along +x
    particleCharge: 1,
    particleMass: 1,
  });
  expect(particleVelocityPrime[0]).toBeCloseTo(expected, 5);
  expect(particleVelocityPrime[1]).toBeCloseTo(0, 5);
  expect(particleVelocityPrime[2]).toBeCloseTo(0, 5);
});

// ─── Lorentz force and acceleration ──────────────────────────────────────────

test('Lorentz force: F = q(E + u×B) analytic', () => {
  // u=(0.5,0,0), E=(0,1,0), B=(0,0,1), q=2
  // u×B = (0,0,0)×... = (0.5,0,0)×(0,0,1) = (0·1−0·0, 0·0−0.5·1, 0.5·0−0·0) = (0,−0.5,0)
  // F = q(E + u×B) = 2((0,1,0)+(0,−0.5,0)) = 2(0,0.5,0) = (0,1,0)
  const { lorentzForce } = getCalculatedQuantities({
    boostVelocity: [0, 0, Math.PI / 2],
    eField: [0, 1, 0],
    bField: [0, 0, 1],
    particleVelocity: [0.5, 0, Math.PI / 2], // u along +x
    particleCharge: 2,
    particleMass: 1,
  });
  closeTo(lorentzForce, [0, 1, 0]);
});

test('relativistic acceleration: a = (F − (F·u)u) / (γm)', () => {
  // u=(0.5,0,0), E=(0,1,0), B=(0,0,0), q=1, m=1
  // F = (0,1,0), F·u = 0
  // γ = 1/√(1−0.25) = 2/√3
  // a = F/(γm) = (0, √3/2, 0)
  const u = 0.5;
  const γ = 1 / Math.sqrt(1 - u * u);
  const { particleAcceleration } = getCalculatedQuantities({
    boostVelocity: [0, 0, Math.PI / 2],
    eField: [0, 1, 0],
    bField: [0, 0, 0],
    particleVelocity: [u, 0, Math.PI / 2],
    particleCharge: 1,
    particleMass: 1,
  });
  closeTo(particleAcceleration, [0, 1 / γ, 0]);
});

// ─── Zero fields ──────────────────────────────────────────────────────────────

test('zero fields remain zero under any boost', () => {
  const { ePrime, bPrime, lorentzForce, lorentzForcePrime } = getCalculatedQuantities({
    boostVelocity: [0.8, Math.PI / 4, Math.PI / 3],
    eField: [0, 0, 0],
    bField: [0, 0, 0],
    ...defaults,
  });
  closeTo(ePrime, [0, 0, 0]);
  closeTo(bPrime, [0, 0, 0]);
  closeTo(lorentzForce, [0, 0, 0]);
  closeTo(lorentzForcePrime, [0, 0, 0]);
});
