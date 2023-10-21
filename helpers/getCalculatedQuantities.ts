import * as THREE from 'three';
import { CartesianComponents, State } from '../store/store';

const cross = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents,
): CartesianComponents => [
  a_y * b_z - b_y * a_z,
  a_z * b_x - b_z * a_x,
  a_x * b_y - b_x * a_y,
];
const dot = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents,
) => a_x * b_x + a_y * b_y + a_z * b_z;

const boostVelocityVec = new THREE.Vector3();
const boostUnitVelocity = boostVelocityVec.clone();

const particleVelocityVec = new THREE.Vector3();
const particleVelocityPrimeVec = new THREE.Vector3();
const particleVelocityPrimeSpherical = new THREE.Spherical();

export const getCalculatedQuantities = ({
  boostVelocity,
  eField,
  bField,
  particleVelocity,
  particleCharge,
  particleMass,
}: {
  boostVelocity: State['boostVelocity'];
  eField: State['eField'];
  bField: State['bField'];
  particleVelocity: State['particleVelocity'];
  particleCharge: State['particleCharge'];
  particleMass: State['particleMass'];
}) => {
  const boostVelocityCartesian = boostVelocityVec
    .setFromSphericalCoords(...boostVelocity)
    .toArray();

  const boostUnit = boostUnitVelocity
    .set(...boostVelocityCartesian)
    .normalize()
    .toArray();

  const boostRapidity = Math.atanh(boostVelocityVec.length());
  const ch = Math.cosh(boostRapidity);
  const sh = Math.sinh(boostRapidity);
  const sh2 = 2 * Math.sinh(boostRapidity / 2) ** 2;
  const crossE = cross(boostUnit, eField);
  const crossB = cross(boostUnit, bField);
  const dotE = dot(boostUnit, eField);
  const dotB = dot(boostUnit, bField);

  const ePrime = eField.map(
    (comp, i) => ch * comp + sh * crossB[i] - sh2 * dotE * boostUnit[i],
  ) as CartesianComponents;
  const bPrime = bField.map(
    (comp, i) => ch * comp - sh * crossE[i] - sh2 * dotB * boostUnit[i],
  ) as CartesianComponents;

  const particleVelocityCartesian = particleVelocityVec
    .setFromSphericalCoords(...particleVelocity)
    .toArray();

  const dotU = dot(boostUnit, particleVelocityCartesian);

  const particleVelocityPrime = particleVelocityCartesian.map(
    (comp, i) => (comp + boostUnit[i] * (sh2 * dotU - sh)) / (ch - sh * dotU),
  ) as CartesianComponents;

  particleVelocityPrimeVec.set(...particleVelocityPrime);
  particleVelocityPrimeSpherical.setFromVector3(particleVelocityPrimeVec);

  const particleVelocityCrossB = cross(particleVelocityCartesian, bField);
  const particleVelocityCrossBPrime = cross(particleVelocityPrime, bPrime);

  const lorentzForce = eField.map(
    (comp, i) => particleCharge * (comp + particleVelocityCrossB[i]),
  ) as CartesianComponents;
  const lorentzForcePrime = ePrime.map(
    (comp, i) => particleCharge * (comp + particleVelocityCrossBPrime[i]),
  ) as CartesianComponents;

  const lorentzDotParticleVelocity = dot(
    lorentzForce,
    particleVelocityCartesian,
  );
  const lorentzDotParticleVelocityPrime = dot(
    lorentzForcePrime,
    particleVelocityPrimeVec.toArray(),
  );

  const particleRapidity = Math.atanh(particleVelocityVec.length());
  const particleRapidityPrime = Math.atanh(particleVelocityPrimeVec.length());

  const particleEnergy = Math.cosh(particleRapidity) * particleMass;
  const particleEnergyPrime = Math.cosh(particleRapidityPrime) * particleMass;

  const particleAcceleration = lorentzForce.map(
    (comp, i) =>
      (comp - lorentzDotParticleVelocity * particleVelocityCartesian[i]) /
      particleEnergy,
  );
  const particleAccelerationPrime = lorentzForcePrime.map(
    (comp, i) =>
      (comp - lorentzDotParticleVelocityPrime * particleVelocityPrime[i]) /
      particleEnergyPrime,
  );

  const poynting = cross(eField, bField);
  const poyntingPrime = cross(ePrime, bPrime);

  return {
    boostVelocityCartesian,
    boostUnit,
    ePrime,
    bPrime,
    particleVelocityCartesian,
    particleVelocityPrime,
    lorentzForce,
    lorentzForcePrime,
    particleAcceleration,
    particleAccelerationPrime,
    poynting,
    poyntingPrime,
    particleVelocityPrimeSpherical,
  };
};
