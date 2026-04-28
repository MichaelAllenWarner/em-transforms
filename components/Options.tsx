import { RefObject, memo } from 'react';
import { OrbitControls } from 'three-stdlib';
import useStore, { State } from '../store/store';
import MathJaxInline from './MathJaxInline';
import { hotkeys } from '../helpers/hotkeys';
import { announceCameraReset } from '../helpers/announce';

interface Props {
  cameraRef: RefObject<OrbitControls>;
  showCompsRef: RefObject<HTMLInputElement>;
  showSRef: RefObject<HTMLInputElement>;
  showURef: RefObject<HTMLInputElement>;
  showFRef: RefObject<HTMLInputElement>;
  showARef: RefObject<HTMLInputElement>;
  hideVRef: RefObject<HTMLInputElement>;
  hideEandBRef: RefObject<HTMLInputElement>;
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
  hideFieldVectors: state.hideFieldVectors,
  setHideFieldVectors: state.setHideFieldVectors,
  setEField: state.setEField,
  setBField: state.setBField,
});

const Options = memo(
  ({
    cameraRef,
    showCompsRef,
    showSRef,
    showURef,
    showFRef,
    showARef,
    hideVRef,
    hideEandBRef,
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
      hideFieldVectors,
      setHideFieldVectors,
      setEField,
      setBField,
    } = useStore(storeSelector);

    return (
      <details className="w-full">
        <summary id="options">Options</summary>
        <fieldset className="ml-4 text-pretty [&_label:has(:disabled)]:cursor-not-allowed [&_:disabled]:cursor-not-allowed">
          <legend className="sr-only">Options</legend>
          <div>
            <label>
              <input
                ref={showURef}
                type="checkbox"
                checked={
                  showParticleVelocity ||
                  ((showLorentzForce || showParticleAcceleration) &&
                    !hideFieldVectors)
                }
                disabled={
                  (showLorentzForce || showParticleAcceleration) &&
                  !hideFieldVectors
                }
                onChange={(e) => setShowParticleVelocity(e.target.checked)}
              />
              Show particle velocity{' '}
              <MathJaxInline content={'\\( \\vec u \\).'} srOnlyText="u" />{' '}
              Hotkey: <kbd>{hotkeys.oneKey.toggleU}</kbd>
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showFRef}
                type="checkbox"
                checked={
                  (showLorentzForce || showParticleAcceleration) &&
                  !hideFieldVectors
                }
                disabled={showParticleAcceleration || hideFieldVectors}
                onChange={(e) => setShowLorentzForce(e.target.checked)}
              />
              Show Lorentz force{' '}
              <MathJaxInline content={'\\( \\vec F \\)'} srOnlyText="(F)" />{' '}
              (and{' '}
              <MathJaxInline content={'\\( \\vec u \\)).'} srOnlyText="u" />{' '}
              Hotkey: <kbd>{hotkeys.oneKey.toggleF}</kbd>
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showARef}
                type="checkbox"
                checked={showParticleAcceleration && !hideFieldVectors}
                disabled={hideFieldVectors}
                onChange={(e) => setShowParticleAcceleration(e.target.checked)}
              />
              Show particle acceleration{' '}
              <MathJaxInline content={'\\( \\vec{a} \\)'} srOnlyText="a" /> (and{' '}
              <MathJaxInline content={'\\( \\vec u \\)'} srOnlyText="u" /> and{' '}
              <MathJaxInline content={'\\( \\vec F \\)).'} srOnlyText="F" />{' '}
              Hotkey: <kbd>{hotkeys.oneKey.toggleA}</kbd>
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showSRef}
                type="checkbox"
                checked={showPoynting && !hideFieldVectors}
                disabled={hideFieldVectors}
                onChange={(e) => setShowPoynting(e.target.checked)}
              />
              Show Poynting vector{' '}
              <MathJaxInline content={'\\( \\vec S \\).'} srOnlyText="S" />{' '}
              Hotkey: <kbd>{hotkeys.oneKey.toggleS}</kbd>
            </label>
          </div>
          <div>
            <label>
              <input
                ref={hideEandBRef}
                type="checkbox"
                checked={hideFieldVectors}
                onChange={(e) => setHideFieldVectors(e.target.checked)}
              />
              Hide fields{' '}
              <MathJaxInline content={'\\( \\vec E \\)'} srOnlyText="E" /> and{' '}
              <MathJaxInline content={'\\( \\vec B \\)'} srOnlyText="B" /> and
              all derived quantities. Hotkey:{' '}
              <kbd>{hotkeys.oneKey.toggleEandB}</kbd>
            </label>
          </div>
          <div>
            <label>
              <input
                ref={showCompsRef}
                type="checkbox"
                checked={showComponentVectors && !hideBoostedQuantities}
                disabled={hideBoostedQuantities}
                onChange={(e) => setShowComponentVectors(e.target.checked)}
              />
              Show components parallel and perpendicular to boost velocity{' '}
              <MathJaxInline content={'\\( \\vec v \\).'} srOnlyText="v" />{' '}
              Hotkey: <kbd>{hotkeys.oneKey.toggleComps}</kbd>
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
              Hide boost velocity{' '}
              <MathJaxInline content={'\\( \\vec v \\),'} srOnlyText="v" />{' '}
              "primed" quantities, and components. Hotkey:{' '}
              <kbd>{hotkeys.oneKey.toggleV}</kbd>
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
                      announceCameraReset();
                    }
                  }}
                >
                  Reset camera. Hotkey: <kbd>{hotkeys.oneKey.resetCamera}</kbd>
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
                    // I₁=0, I₂=0 — null field; E along z, B along -y → E×B = +x (propagates along boost)
                    setEField([0, 0, 2]);
                    setBField([0, -2, 0]);
                  }}
                >
                  Light-wave toward{' '}
                  <MathJaxInline content={'\\( x \\)'} srOnlyText="x" />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // I₁=0, I₂=0 — null field; E along -y, B along -x → E×B = -z
                    setEField([0, -2, 0]);
                    setBField([-2, 0, 0]);
                  }}
                >
                  Light-wave toward{' '}
                  <MathJaxInline
                    content={'\\( {-z} \\)'}
                    srOnlyText="negative z"
                  />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // I₁>0, I₂=0 — pure E; boost creates B along -y
                    setEField([0, 0, -2]);
                    setBField([0, 0, 0]);
                  }}
                >
                  Pure{' '}
                  <MathJaxInline content={'\\( \\vec E \\)'} srOnlyText="E" />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // I₁<0, I₂=0 — pure B; boost creates E along -y
                    setEField([0, 0, 0]);
                    setBField([0, 0, 2]);
                  }}
                >
                  Pure{' '}
                  <MathJaxInline content={'\\( \\vec B \\)'} srOnlyText="B" />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // I₁=0, I₂=1 — E∥B along z, |E|=|B|; both invariants nonzero
                    setEField([0, 0, 1]);
                    setBField([0, 0, 1]);
                  }}
                >
                  <MathJaxInline
                    content={'\\( \\vec E \\parallel \\vec B \\)'}
                    srOnlyText="E parallel to B"
                  />
                  ,{' '}
                  <MathJaxInline
                    content={'\\( |\\vec E| = |\\vec B| \\)'}
                    srOnlyText="E magnitude equals B magnitude"
                  />
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    // I₁=3, I₂=1 — general mixed; E and B in xz-plane, no y component
                    setEField([1, 0, 2]);
                    setBField([-1, 0, 1]);
                  }}
                >
                  <MathJaxInline
                    content={'\\( \\vec E \\cdot \\vec B \\neq 0 \\)'}
                    srOnlyText="E dot B not zero"
                  />{' '}
                  (general)
                </button>
              </div>
            </div>
          </details>
        </fieldset>
      </details>
    );
  },
);

Options.displayName = 'Options';

export default Options;
