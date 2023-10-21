import useStore, { State } from '../store/store';
import { useDebounced } from './useDebounced';
import { QueryParameterKey } from '../helpers/QueryParamKey';
import { useEffect, useRef } from 'react';

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
});

/**
 * Sets query-parameters from state on state-change (but not on mount).
 * The camera-related query-parameters are set separately on camera-change
 * in `CameraControls.tsx`.
 */
export const useSetQueryParams = () => {
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
  } = useStore(storeSelector);

  const setQueryParams = () => {
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
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const debouncedSetQueryParams = useDebounced(setQueryParams, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      debouncedSetQueryParams();
    }
  });
};
