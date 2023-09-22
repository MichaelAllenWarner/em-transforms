import { shallow } from 'zustand/shallow';
import useStore, { State } from '../store/store';
import { useEffect, useRef } from 'react';

enum QueryParameterKey {
  eX = 'eX',
  eY = 'eY',
  eZ = 'eZ',
  bX = 'bX',
  bY = 'bY',
  bZ = 'bZ',
  vR = 'vR',
  uR = 'uR',
  vPhi = 'vPhi',
  uPhi = 'uPhi',
  vTheta = 'vTheta',
  uTheta = 'uTheta',
  showComps = 'showComps',
  showS = 'showS',
  showU = 'showU',
  showF = 'showF',
  showA = 'showA',
  hideV = 'hideV',
  hideEandB = 'hideEandB',
  q = 'q',
  m = 'm',
}

const storeSelector = (state: State) => ({
  eField: state.eField,
  bField: state.bField,
  boostVelocity: state.boostVelocity,
  particleVelocity: state.particleVelocity,
  particleCharge: state.particleCharge,
  particleMass: state.particleMass,
  showComponentVectors: state.showComponentVectors,
  showPoynting: state.showPoynting,
  showParticleVelocity: state.showParticleVelocity,
  showLorentzForce: state.showLorentzForce,
  showParticleAcceleration: state.showParticleAcceleration,
  hideBoostedQuantities: state.hideBoostedQuantities,
  hideFieldVectors: state.hideFieldVectors,
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

/**
 * First time it runs, it sets the state from the query parameters.
 * Every other timem it runs, it sets the query parameters from the state.
 */
export const useStateToAndFromQueryParams = () => {
  const {
    eField,
    bField,
    boostVelocity,
    particleVelocity,
    particleCharge,
    particleMass,
    showComponentVectors,
    showPoynting,
    showParticleVelocity,
    showLorentzForce,
    showParticleAcceleration,
    hideBoostedQuantities,
    hideFieldVectors,
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

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;

      // console.log('Setting state from query params');

      const queryParams = new URLSearchParams(window.location.search);

      // Cartesian components
      for (const { key, setter } of [
        {
          key: QueryParameterKey.eX,
          setter: setEFieldX,
        },
        {
          key: QueryParameterKey.eY,
          setter: setEFieldY,
        },
        {
          key: QueryParameterKey.eZ,
          setter: setEFieldZ,
        },
        {
          key: QueryParameterKey.bX,
          setter: setBFieldX,
        },
        {
          key: QueryParameterKey.bY,
          setter: setBFieldY,
        },
        {
          key: QueryParameterKey.bZ,
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
          key: QueryParameterKey.vR,
          setter: setBoostVelocityR,
        },
        {
          key: QueryParameterKey.uR,
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
          key: QueryParameterKey.vPhi,
          setter: setBoostVelocityPhi,
        },
        {
          key: QueryParameterKey.vTheta,
          setter: setBoostVelocityTheta,
        },
        {
          key: QueryParameterKey.uPhi,
          setter: setParticleVelocityPhi,
        },
        {
          key: QueryParameterKey.uTheta,
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

        setter(n);
      }

      // booleans
      for (const { key, setter } of [
        {
          key: QueryParameterKey.showComps,
          setter: setShowComponentVectors,
        },
        {
          key: QueryParameterKey.showS,
          setter: setShowPoynting,
        },
        {
          key: QueryParameterKey.showU,
          setter: setShowParticleVelocity,
        },
        {
          key: QueryParameterKey.showF,
          setter: setShowLorentzForce,
        },
        {
          key: QueryParameterKey.showA,
          setter: setShowParticleAcceleration,
        },
        {
          key: QueryParameterKey.hideV,
          setter: setHideBoostedQuantities,
        },
        {
          key: QueryParameterKey.hideEandB,
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
      if (queryParams.has(QueryParameterKey.q)) {
        const value = queryParams.get(QueryParameterKey.q);
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
      if (queryParams.has(QueryParameterKey.m)) {
        const value = queryParams.get(QueryParameterKey.m);
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
    } else {
      // console.log('Setting query params from state');

      const params = new URLSearchParams(window.location.search);

      params.set(QueryParameterKey.eX, eField[0].toString());
      params.set(QueryParameterKey.eY, eField[1].toString());
      params.set(QueryParameterKey.eZ, eField[2].toString());
      params.set(QueryParameterKey.bX, bField[0].toString());
      params.set(QueryParameterKey.bY, bField[1].toString());
      params.set(QueryParameterKey.bZ, bField[2].toString());
      params.set(QueryParameterKey.vR, boostVelocity[0].toString());
      params.set(QueryParameterKey.vPhi, boostVelocity[1].toString());
      params.set(QueryParameterKey.vTheta, boostVelocity[2].toString());
      params.set(QueryParameterKey.uR, particleVelocity[0].toString());
      params.set(QueryParameterKey.uPhi, particleVelocity[1].toString());
      params.set(QueryParameterKey.uTheta, particleVelocity[2].toString());
      params.set(QueryParameterKey.q, particleCharge.toString());
      params.set(QueryParameterKey.m, particleMass.toString());
      params.set(QueryParameterKey.showComps, showComponentVectors.toString());
      params.set(QueryParameterKey.showS, showPoynting.toString());
      params.set(QueryParameterKey.showU, showParticleVelocity.toString());
      params.set(QueryParameterKey.showF, showLorentzForce.toString());
      params.set(QueryParameterKey.showA, showParticleAcceleration.toString());
      params.set(QueryParameterKey.hideV, hideBoostedQuantities.toString());
      params.set(QueryParameterKey.hideEandB, hideFieldVectors.toString());

      // might be nice to debounce this
      window.history.replaceState({}, '', `?${params.toString()}`);
    }
  }, [
    bField,
    boostVelocity,
    eField,
    hideBoostedQuantities,
    hideFieldVectors,
    particleCharge,
    particleMass,
    particleVelocity,
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
    showComponentVectors,
    showLorentzForce,
    showParticleAcceleration,
    showParticleVelocity,
    showPoynting,
  ]);
};
