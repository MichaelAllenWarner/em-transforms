import { MathJax } from 'better-react-mathjax';
import { MutableRefObject, memo } from 'react';
import { OrbitControls } from 'three-stdlib';
import shallow from 'zustand/shallow';
import useStore, { State } from '../store/store';

interface Props {
  cameraRef: MutableRefObject<OrbitControls | undefined>;
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
              type="checkbox"
              checked={showComponentVectors && !hideBoostedQuantities}
              disabled={hideBoostedQuantities}
              onChange={(e) => setShowComponentVectors(e.target.checked)}
            />
            Show component-vectors parallel and perpendicular to the
            boost-velocity{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax>.
            </span>
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showPoynting}
              onChange={(e) => setShowPoynting(e.target.checked)}
            />
            Show the Poynting vector{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\vec S = \\vec E \\times \\vec B \\)'}
              </MathJax>
              .
            </span>
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
            Show the particle velocity{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec u \\)'}</MathJax>.
            </span>
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
            Show the Lorentz force acting on the particle:{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\)'}
              </MathJax>
              .
            </span>{' '}
            (Will show{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec u \\)'}</MathJax>,
            </span>{' '}
            too.)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showParticleAcceleration}
              onChange={(e) => setShowParticleAcceleration(e.target.checked)}
            />
            Show the particle's acceleration resulting from the Lorentz force
            (assuming constant particle mass{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( m \\)'}</MathJax>):
            </span>{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {
                  '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\)'
                }
              </MathJax>
              ,
            </span>{' '}
            with{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>
                {'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\)'}
              </MathJax>
              .
            </span>{' '}
            (Will show <MathJax inline>{'\\( \\vec u \\)'}</MathJax> and{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec F \\)'}</MathJax>,
            </span>{' '}
            too.)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={hideBoostedQuantities}
              onChange={(e) => setHideBoostedQuantities(e.target.checked)}
            />
            Hide the boost-velocity{' '}
            <MathJax inline>{'\\( \\vec v \\)'}</MathJax> and the boosted
            ("primed") quantities. (Will also hide the component-vectors
            parallel and perpendicular to{' '}
            <span className="whitespace-nowrap">
              <MathJax inline>{'\\( \\vec v \\)'}</MathJax>.)
            </span>
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
                type="button"
                onClick={() => {
                  setBoostVelocityPhi(Math.PI / 2);
                  setBoostVelocityTheta(Math.PI / 2);
                }}
              >
                Reset boost-direction{' '}
                <span className="whitespace-nowrap">
                  (<MathJax inline>{'\\( +x \\)'}</MathJax>)
                </span>
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setParticleVelocityPhi(-Math.PI / 2);
                  setParticleVelocityTheta(Math.PI / 2);
                }}
              >
                Reset particle's velocity-direction{' '}
                <span className="whitespace-nowrap">
                  (<MathJax inline>{'\\( -x \\)'}</MathJax>)
                </span>
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
                Light-wave toward <MathJax inline>{'\\( x \\)'}</MathJax>
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
                Light-wave toward <MathJax inline>{'\\( z \\)'}</MathJax>
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
                Parallel fields on <MathJax inline>{'\\( z \\)'}</MathJax>
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
                Anti-parallel fields on <MathJax inline>{'\\( z \\)'}</MathJax>
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
});

Options.displayName = 'Options';

export default Options;
