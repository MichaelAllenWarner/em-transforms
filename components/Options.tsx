import { MathJax } from 'better-react-mathjax';
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
    <details className="w-full">
      <summary className="mt-2 max-w-max cursor-pointer">Options</summary>
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
            boost-velocity <MathJax inline>{'\\( \\vec v \\)'}</MathJax>.
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
            <MathJax inline>
              {'\\( \\vec S = \\vec E \\times \\vec B \\)'}
            </MathJax>
            .
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
            <MathJax inline>{'\\( \\vec u \\)'}</MathJax>.
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
            <MathJax inline>
              {'\\( \\vec F = q( \\vec E + \\vec u \\times \\vec B ) \\)'}
            </MathJax>
            . (Will show <MathJax inline>{'\\( \\vec u \\)'}</MathJax>, too.)
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={showParticleAcceleration}
              onChange={(e) => setShowParticleAcceleration(e.target.checked)}
            />
            Show the particle's acceleration resulting from the Lorentz force:{' '}
            <MathJax inline>
              {
                '\\( \\vec{a} = \\frac{ \\vec{F} - ( \\vec{F} \\cdot \\vec{u} ) \\vec{u} }{ \\gamma m } \\)'
              }
            </MathJax>
            , with{' '}
            <MathJax inline>
              {'\\( \\gamma = \\frac{ 1 }{ \\sqrt{ 1 - u^2 } } \\)'}
            </MathJax>
            . (Will show <MathJax inline>{'\\( \\vec u \\)'}</MathJax> and{' '}
            <MathJax inline>{'\\( \\vec F \\)'}</MathJax>, too.)
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
            <MathJax inline>{'\\( \\vec v \\)'}</MathJax>.)
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
          <summary className="mt-2 max-w-max cursor-pointer">
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
    </details>
  );
});

Options.displayName = 'Options';

export default Options;
