import { RefObject, memo } from 'react';
import { OrbitControls } from 'three-stdlib';
import { shallow } from 'zustand/shallow';
import useStore, { State } from '../store/store';
import MathJaxInline from './MathJaxInline';

interface Props {
  cameraRef: RefObject<OrbitControls>;
  vResetRef: RefObject<HTMLButtonElement>;
  uResetRef: RefObject<HTMLButtonElement>;
  showCompsRef: RefObject<HTMLInputElement>;
  showSRef: RefObject<HTMLInputElement>;
  showURef: RefObject<HTMLInputElement>;
  showFRef: RefObject<HTMLInputElement>;
  showARef: RefObject<HTMLInputElement>;
  hideVRef: RefObject<HTMLInputElement>;
}

const storeSelector = (state: State) => ({
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
  setBoostVelocityPhi: state.setBoostVelocityPhi,
  setBoostVelocityTheta: state.setBoostVelocityTheta,
  setParticleVelocityPhi: state.setParticleVelocityPhi,
  setParticleVelocityTheta: state.setParticleVelocityTheta,
});

const Options = memo(
  ({
    cameraRef,
    vResetRef,
    uResetRef,
    showCompsRef,
    showSRef,
    showURef,
    showFRef,
    showARef,
    hideVRef,
  }: Props) => {
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
      setBoostVelocityPhi,
      setBoostVelocityTheta,
      setParticleVelocityPhi,
      setParticleVelocityTheta,
    } = useStore(storeSelector, shallow);

    return (
      <details className="w-full">
        <summary className="mt-2">Options</summary>
        <fieldset className="ml-4">
          <legend className="sr-only">Options</legend>
          <div>
            <label>
              <input
                ref={showCompsRef}
                type="checkbox"
                checked={showComponentVectors && !hideBoostedQuantities}
                disabled={hideBoostedQuantities}
                onChange={(e) => setShowComponentVectors(e.target.checked)}
              />
              Show component-vectors parallel and perpendicular to the
              boost-velocity <MathJaxInline content={'\\( \\vec v \\).'} />
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showSRef}
                type="checkbox"
                checked={showPoynting}
                onChange={(e) => setShowPoynting(e.target.checked)}
              />
              Show the Poynting vector{' '}
              <MathJaxInline
                content={'\\( \\vec S = \\vec E \\times \\vec B \\).'}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showURef}
                type="checkbox"
                checked={
                  showParticleVelocity ||
                  showLorentzForce ||
                  showParticleAcceleration
                }
                disabled={showLorentzForce || showParticleAcceleration}
                onChange={(e) => setShowParticleVelocity(e.target.checked)}
              />
              Show the particle velocity{' '}
              <MathJaxInline content={'\\( \\vec u \\).'} />
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showFRef}
                type="checkbox"
                checked={showLorentzForce || showParticleAcceleration}
                disabled={showParticleAcceleration}
                onChange={(e) => setShowLorentzForce(e.target.checked)}
              />
              Show the Lorentz force acting on the particle:{' '}
              <MathJaxInline
                content={
                  '\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\).'
                }
              />{' '}
              (Will show <MathJaxInline content={'\\( \\vec u \\),'} /> too.)
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showARef}
                type="checkbox"
                checked={showParticleAcceleration}
                onChange={(e) => setShowParticleAcceleration(e.target.checked)}
              />
              Show the particle's acceleration resulting from the Lorentz force
              (assuming constant particle mass{' '}
              <MathJaxInline content={'\\( m \\)):'} />{' '}
              <MathJaxInline
                content={
                  '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\),'
                }
              />{' '}
              with{' '}
              <MathJaxInline
                content={'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\).'}
              />{' '}
              (Will show <MathJaxInline content={'\\( \\vec u \\)'} /> and{' '}
              <MathJaxInline content={'\\( \\vec F \\),'} /> too.)
            </label>
          </div>
          <div>
            <label>
              <input
                ref={hideVRef}
                type="checkbox"
                checked={hideBoostedQuantities}
                onChange={(e) => setHideBoostedQuantities(e.target.checked)}
              />
              Hide the boost-velocity{' '}
              <MathJaxInline content={'\\( \\vec v \\)'} /> and the boosted
              ("primed") quantities. (Will also hide the component-vectors
              parallel and perpendicular to{' '}
              <MathJaxInline content={'\\( \\vec v \\).)'} />
            </label>
          </div>

          <div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (cameraRef.current) {
                      cameraRef.current.reset();
                    }
                  }}
                >
                  Reset camera
                </button>
              </div>
              <div>
                <button
                  ref={vResetRef}
                  type="button"
                  onClick={() => {
                    setBoostVelocityPhi(Math.PI / 2);
                    setBoostVelocityTheta(Math.PI / 2);
                  }}
                >
                  Reset boost-direction{' '}
                  <MathJaxInline content={'(\\( +x \\))'} />
                </button>
              </div>
              <div>
                <button
                  ref={uResetRef}
                  type="button"
                  onClick={() => {
                    setParticleVelocityPhi(-Math.PI / 2);
                    setParticleVelocityTheta(Math.PI / 2);
                  }}
                >
                  Reset particle's velocity-direction{' '}
                  <MathJaxInline content={'(\\( -x \\))'} />
                </button>
              </div>
            </div>
          </div>

          <details className="space-y-2">
            <summary className="mt-2">
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
                  Light-wave toward <MathJaxInline content={'\\( x \\)'} />
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
                  Light-wave toward <MathJaxInline content={'\\( z \\)'} />
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
                  Parallel fields on <MathJaxInline content={'\\( z \\)'} />
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
                  Anti-parallel fields on{' '}
                  <MathJaxInline content={'\\( z \\)'} />
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
      </details>
    );
  }
);

Options.displayName = 'Options';

export default Options;
