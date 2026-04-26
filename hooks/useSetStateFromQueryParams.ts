import useStore, { State } from '../store/store';
import { useEffect, useRef } from 'react';
import { QueryParameterKey } from '../helpers/QueryParamKey';
import { isLegacyUrl } from '../helpers/urlParams';

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
 * Sets state from query-parameters on mount.
 * The camera "state" is set from query-parameters on mount separately,
 * in `CameraControls.tsx`.
 */
export const useSetStateFromQueryParams = () => {
  const isFirstRender = useRef(true);

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
  } = useStore(storeSelector);

  useEffect(() => {
    if (!isFirstRender.current) return;

    isFirstRender.current = false;

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

      const n = Number(value);
      if (!Number.isFinite(n)) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`,
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
          `Value \`${value}\` for query parameter \`${key}\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`,
        );
        continue;
      }

      if (n >= 1) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` is greater than or equal to 1. Setting to 0.9999.`,
        );
        n = 0.9999;
      }

      if (n < 0) {
        console.warn(
          `Value \`${value}\` for query parameter \`${key}\` is less than 0. Setting to 0.`,
        );
        n = 0;
      }

      setter(n);
    }

    // phi- and theta-components (spherical)
    // Legacy URLs (has params but no v) used Three.js convention:
    //   phi = polar from y-axis, theta = azimuthal from z toward x
    // New URLs (v=2, or no params at all) use physics convention:
    //   phi = azimuthal from x toward y, theta = polar from z
    const legacyUrl = isLegacyUrl(queryParams);

    const convertLegacySpherical = (
      r: number,
      phi_three: number,
      theta_three: number,
    ) => {
      // Three.js: x=r sin(φ)sin(θ), y=r cos(φ), z=r sin(φ)cos(θ)
      const x = r * Math.sin(phi_three) * Math.sin(theta_three);
      const y = r * Math.cos(phi_three);
      const z = r * Math.sin(phi_three) * Math.cos(theta_three);
      return {
        phi: Math.atan2(y, x),
        theta: r === 0 ? 0 : Math.acos(Math.max(-1, Math.min(1, z / r))),
      };
    };

    for (const { rKey, phiKey, thetaKey, phiSetter, thetaSetter, rGetter } of [
      {
        rKey: QueryParameterKey.vR,
        phiKey: QueryParameterKey.vPhi,
        thetaKey: QueryParameterKey.vTheta,
        phiSetter: setBoostVelocityPhi,
        thetaSetter: setBoostVelocityTheta,
        rGetter: () => boostVelocity[0],
      },
      {
        rKey: QueryParameterKey.uR,
        phiKey: QueryParameterKey.uPhi,
        thetaKey: QueryParameterKey.uTheta,
        phiSetter: setParticleVelocityPhi,
        thetaSetter: setParticleVelocityTheta,
        rGetter: () => particleVelocity[0],
      },
    ]) {
      const rawPhi = queryParams.has(phiKey)
        ? Number(queryParams.get(phiKey))
        : null;
      const rawTheta = queryParams.has(thetaKey)
        ? Number(queryParams.get(thetaKey))
        : null;
      if (rawPhi === null && rawTheta === null) continue;

      if (legacyUrl) {
        const r = queryParams.has(rKey)
          ? Number(queryParams.get(rKey))
          : rGetter();
        const converted = convertLegacySpherical(r, rawPhi ?? 0, rawTheta ?? 0);
        if (rawPhi !== null) {
          if (Number.isFinite(converted.phi)) phiSetter(converted.phi);
          else console.warn(`Query parameter \`${phiKey}\` produced a non-finite converted value. Skipping.`);
        }
        if (rawTheta !== null) {
          if (Number.isFinite(converted.theta)) thetaSetter(converted.theta);
          else console.warn(`Query parameter \`${thetaKey}\` produced a non-finite converted value. Skipping.`);
        }
      } else {
        if (rawPhi !== null) {
          if (Number.isFinite(rawPhi)) phiSetter(rawPhi);
          else console.warn(`Value for query parameter \`${phiKey}\` isn't finite when coerced to a number. It is \`${rawPhi}\`. Skipping.`);
        }
        if (rawTheta !== null) {
          if (Number.isFinite(rawTheta)) thetaSetter(rawTheta);
          else console.warn(`Value for query parameter \`${thetaKey}\` isn't finite when coerced to a number. It is \`${rawTheta}\`. Skipping.`);
        }
      }
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
          `Value \`${value}\` for query parameter \`${key}\` isn't \`true\` or \`false\`. Skipping.`,
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
            `Value \`${value}\` for query parameter \`q\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`,
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
            `Value \`${value}\` for query parameter \`m\` isn't finite when coerced to a number. It is \`${n}\`. Skipping.`,
          );
        } else {
          if (n <= 0) {
            console.warn(
              `Value \`${value}\` for query parameter \`m\` is less than or equal to 0. Setting to 0.1.`,
            );
            n = 0.1;
          }
          setParticleMass(n);
        }
      }
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
