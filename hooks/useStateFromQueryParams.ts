import { shallow } from 'zustand/shallow';
import useStore, { State } from '../store/store';
import { degToRad } from '../helpers/degRad';
import { useEffect } from 'react';

const storeSelector = (state: State) => ({
  setEFieldX: state.setEFieldX,
  setEFieldY: state.setEFieldY,
  setEFieldZ: state.setEFieldZ,
  setBFieldX: state.setBFieldX,
  setBFieldY: state.setBFieldY,
  setBFieldZ: state.setBFieldZ,
  setBoostVelocityR: state.setBoostVelocityR,
  setBoostVelocityPhi: state.setBoostVelocityPhi,
  setBoostVelocityTheta: state.setBoostVelocityTheta,
  setParticleVelocityR: state.setParticleVelocityR,
  setParticleVelocityPhi: state.setParticleVelocityPhi,
  setParticleVelocityTheta: state.setParticleVelocityTheta,
  setParticleCharge: state.setParticleCharge,
  setParticleMass: state.setParticleMass,

  setShowComponentVectors: state.setShowComponentVectors,
  setShowPoynting: state.setShowPoynting,
  setShowParticleVelocity: state.setShowParticleVelocity,
  setShowLorentzForce: state.setShowLorentzForce,
  setShowParticleAcceleration: state.setShowParticleAcceleration,
  setHideBoostedQuantities: state.setHideBoostedQuantities,
  setHideFieldVectors: state.setHideFieldVectors,
});

export const useStateFromQueryParams = () => {
  const {
    setEFieldX,
    setEFieldY,
    setEFieldZ,
    setBFieldX,
    setBFieldY,
    setBFieldZ,
    setBoostVelocityR,
    setBoostVelocityPhi,
    setBoostVelocityTheta,
    setParticleVelocityR,
    setParticleVelocityPhi,
    setParticleVelocityTheta,
    setParticleCharge,
    setParticleMass,
    setShowComponentVectors,
    setShowPoynting,
    setShowParticleVelocity,
    setShowLorentzForce,
    setShowParticleAcceleration,
    setHideBoostedQuantities,
    setHideFieldVectors,
  } = useStore(storeSelector, shallow);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    // Cartesian components
    for (const { key, setter } of [
      {
        key: 'eX',
        setter: setEFieldX,
      },
      {
        key: 'eY',
        setter: setEFieldY,
      },
      {
        key: 'eZ',
        setter: setEFieldZ,
      },
      {
        key: 'bX',
        setter: setBFieldX,
      },
      {
        key: 'bY',
        setter: setBFieldY,
      },
      {
        key: 'bZ',
        setter: setBFieldZ,
      },
    ]) {
      if (!queryParams.has(key)) continue;

      const value = queryParams.get(key);
      if (!value) {
        console.warn(`No value for query parameter \`${key}\`.`);
        continue;
      }

      let n = Number(value);
      if (!Number.isFinite(n)) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`
        );
        continue;
      }

      setter(n);
    }

    // r-components (spherical)
    for (const { key, setter } of [
      {
        key: 'vR',
        setter: setBoostVelocityR,
      },
      {
        key: 'uR',
        setter: setParticleVelocityR,
      },
    ]) {
      if (!queryParams.has(key)) continue;

      const value = queryParams.get(key);
      if (!value) {
        console.warn(`No value for query parameter \`${key}\`.`);
        continue;
      }

      let n = Number(value);
      if (!Number.isFinite(n)) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`
        );
        continue;
      }

      if (n >= 1) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` is greater than or equal to 1. Setting to 0.9999.`
        );
        n = 0.9999;
      }

      if (n < 0) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` is less than 0. Setting to 0.`
        );
        n = 0;
      }

      setter(n);
    }

    // phi- and theta-components (spherical)
    for (const { key, setter } of [
      {
        key: 'vPhi',
        setter: setBoostVelocityPhi,
      },
      {
        key: 'vTheta',
        setter: setBoostVelocityTheta,
      },
      {
        key: 'uPhi',
        setter: setParticleVelocityPhi,
      },
      {
        key: 'uTheta',
        setter: setParticleVelocityTheta,
      },
    ]) {
      if (!queryParams.has(key)) continue;

      const value = queryParams.get(key);
      if (!value) {
        console.warn(`No value for query parameter \`${key}\`.`);
        continue;
      }

      const n = Number(value);
      if (!Number.isFinite(n)) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`
        );
        continue;
      }

      setter(degToRad(n));
    }

    // booleans
    for (const { key, setter } of [
      {
        key: 'showComps',
        setter: setShowComponentVectors,
      },
      {
        key: 'showS',
        setter: setShowPoynting,
      },
      {
        key: 'showU',
        setter: setShowParticleVelocity,
      },
      {
        key: 'showF',
        setter: setShowLorentzForce,
      },
      {
        key: 'showA',
        setter: setShowParticleAcceleration,
      },
      {
        key: 'hideV',
        setter: setHideBoostedQuantities,
      },
      {
        key: 'hideEandB',
        setter: setHideFieldVectors,
      },
    ]) {
      if (!queryParams.has(key)) continue;

      const value = queryParams.get(key);
      if (!value) {
        console.warn(`No value for query parameter \`${key}\`.`);
        continue;
      }

      if (value !== 'true' && value !== 'false') {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` isn't \`true\` or \`false\`. Skipping.`
        );
        continue;
      }

      setter(value === 'true');
    }

    // charge
    if (queryParams.has('q')) {
      const value = queryParams.get('q');
      if (!value) {
        console.warn(`No value for query parameter \`q\`. Skipping.`);
      } else {
        const n = Number(value);
        if (!Number.isFinite(n)) {
          console.warn(
            `Value \`${value}\` for query parameter \`q\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`
          );
        } else {
          setParticleCharge(n);
        }
      }
    }

    // mass
    if (queryParams.has('m')) {
      const value = queryParams.get('m');
      if (!value) {
        console.warn(`No value for query parameter \`m\`. Skipping.`);
      } else {
        let n = Number(value);
        if (!Number.isFinite(n)) {
          console.warn(
            `Value \`${value}\` for query parameter \`m\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`
          );
        } else {
          if (n <= 0) {
            console.warn(
              `Value \`${value}\` for query parameter \`m\` is less than or equal to 0. Setting to 0.1.`
            );
            n = 0.1;
          }
          setParticleMass(n);
        }
      }
    }
  }, [
    setBFieldX,
    setBFieldY,
    setBFieldZ,
    setBoostVelocityPhi,
    setBoostVelocityR,
    setBoostVelocityTheta,
    setEFieldX,
    setEFieldY,
    setEFieldZ,
    setHideBoostedQuantities,
    setHideFieldVectors,
    setParticleCharge,
    setParticleMass,
    setParticleVelocityPhi,
    setParticleVelocityR,
    setParticleVelocityTheta,
    setShowComponentVectors,
    setShowLorentzForce,
    setShowParticleAcceleration,
    setShowParticleVelocity,
    setShowPoynting,
  ]);
};
