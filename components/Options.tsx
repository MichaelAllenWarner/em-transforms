/* eslint-disable react/no-unescaped-entities */
import { MutableRefObject, memo } from 'react';
import { OrbitControls } from 'three-stdlib';
import shallow from 'zustand/shallow';
import useStore from '../helpers/store';

interface Props {
  cameraRef: MutableRefObject<OrbitControls | undefined>;
}

const Options = memo(({ cameraRef }: Props) => {
  const {
    showComponentVectors,
    showPoynting,
    showParticleVelocity,
    showLorentzForce,
    showParticleAcceleration,
    setShowComponentVectors,
    setShowPoynting,
    setShowParticleVelocity,
    setShowLorentzForce,
    setShowParticleAcceleration,
    hideBoostedQuantities,
    setHideBoostedQuantities,
    setEField,
    setBField,
  } = useStore(
    (state) => ({
      showComponentVectors: state.showComponentVectors,
      setShowComponentVectors: state.setShowComponentVectors,
      showPoynting: state.showPoynting,
      setShowPoynting: state.setShowPoynting,
      showParticleVelocity: state.showParticleVelocity,
      setShowParticleVelocity: state.setShowParticleVelocity,
      showLorentzForce: state.showLorentzForce,
      setShowLorentzForce: state.setShowLorentzForce,
      showParticleAcceleration: state.showParticleAcceleration,
      setShowParticleAcceleration: state.setShowParticleAcceleration,
      hideBoostedQuantities: state.hideBoostedQuantities,
      setHideBoostedQuantities: state.setHideBoostedQuantities,
      setEField: state.setEField,
      setBField: state.setBField,
    }),
    shallow
  );

  return (
    <fieldset className="w-full">
      <legend>Options</legend>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showComponentVectors}
            disabled={hideBoostedQuantities}
            onChange={(e) => setShowComponentVectors(e.target.checked)}
          />
          Show component-vectors parallel and perpendicular to boost-velocity.
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showPoynting}
            onChange={(e) => setShowPoynting(e.target.checked)}
          />
          Show the Poynting vector (S = E x B).
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={
              showParticleVelocity ||
              showLorentzForce ||
              showParticleAcceleration
            }
            disabled={showLorentzForce || showParticleAcceleration}
            onChange={(e) => setShowParticleVelocity(e.target.checked)}
          />
          Show particle velocity (u).
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showLorentzForce || showParticleAcceleration}
            disabled={showParticleAcceleration}
            onChange={(e) => setShowLorentzForce(e.target.checked)}
          />
          Show the Lorentz force (F = q(E + u x B)) acting on the particle.
          (Will show the particle velocity, too.)
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showParticleAcceleration}
            onChange={(e) => setShowParticleAcceleration(e.target.checked)}
          />
          Show the particle's acceleration (a = (F - (F • v)v) / (γm), γ = 1/√(1
          - v²)) resulting from the Lorentz force. (Will show the particle
          velocity and the Lorentz force, too.)
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={hideBoostedQuantities}
            onChange={(e) => setHideBoostedQuantities(e.target.checked)}
          />
          Hide the boost-velocity and the boosted quantities.
        </label>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            if (cameraRef.current) {
              cameraRef.current.reset();
            }
          }}
        >
          Reset Camera
        </button>
      </div>

      <details className="space-y-2">
        <summary className="mt-2 w-max cursor-pointer">
          Some interesting preset field configurations
        </summary>
        <div className="flex flex-wrap gap-2">
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 1, 0]);
                setBField([0, 0, 1]);
              }}
            >
              Light-wave toward x
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([-1, 0, 0]);
                setBField([0, -1, 0]);
              }}
            >
              Light-wave toward z
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 1]);
                setBField([0, 0, 1]);
              }}
            >
              Parallel fields on z
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([1, 1, 1]);
                setBField([1, 1, 1]);
              }}
            >
              Parallel fields, tilted
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 1]);
                setBField([0, 0, -1]);
              }}
            >
              Anti-parallel fields on z
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([1, 1, 1]);
                setBField([-1, -1, -1]);
              }}
            >
              Anti-parallel fields, tilted
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 0]);
                setBField([-1, 1, -1]);
              }}
            >
              No electric
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setBField([0, 0, 0]);
                setEField([-1, 1, -1]);
              }}
            >
              No magnetic
            </button>
          </div>
        </div>
      </details>
    </fieldset>
  );
});

Options.displayName = 'Options';

export default Options;
