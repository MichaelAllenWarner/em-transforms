import { RefObject } from 'react';
import { OrbitControls } from 'three-stdlib';
import useStore, { State } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
import MathJaxInline from './MathJaxInline';
import { hotkeys } from '../helpers/hotkeys';
import { announceCameraReset } from '../helpers/announce';

interface Props {
  cameraRef: RefObject<OrbitControls | null>;
  showCompsRef: RefObject<HTMLInputElement | null>;
  showSRef: RefObject<HTMLInputElement | null>;
  showURef: RefObject<HTMLInputElement | null>;
  showFRef: RefObject<HTMLInputElement | null>;
  showARef: RefObject<HTMLInputElement | null>;
  hideVRef: RefObject<HTMLInputElement | null>;
  hideEandBRef: RefObject<HTMLInputElement | null>;
  showInvariantsRef: RefObject<HTMLInputElement | null>;
  rotateX: () => void;
  rotateY: () => void;
  rotateZ: () => void;
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
  showInvariants: state.showInvariants,
  setShowInvariants: state.setShowInvariants,
  setEField: state.setEField,
  setBField: state.setBField,
});

const Options = ({
  cameraRef,
  showCompsRef,
  showSRef,
  showURef,
  showFRef,
  showARef,
  hideVRef,
  hideEandBRef,
  showInvariantsRef,
  rotateX,
  rotateY,
  rotateZ,
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
    showInvariants,
    setShowInvariants,
    setEField,
    setBField,
  } = useStore(useShallow(storeSelector));

  return (
    <div className="w-full flex flex-col gap-4">
      <details>
        <summary id="options">Options</summary>
        <fieldset className="ml-4 mt-2">
          <legend className="sr-only">Options</legend>
          <div className="flex flex-col gap-2 text-pretty [&_label]:inline-flex [&_label]:gap-2 [&_label:has(:disabled)]:cursor-not-allowed [&_:disabled]:cursor-not-allowed">
            <div>
              <label>
                <span>
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
                    aria-label={`Show particle velocity (u). Hot-key: ${hotkeys.oneKey.toggleU}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show particle velocity{' '}
                  <MathJaxInline content={'\\( \\vec u \\).'} srOnlyText="u" />{' '}
                  Hotkey: <kbd>{hotkeys.oneKey.toggleU}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={showFRef}
                    type="checkbox"
                    checked={
                      (showLorentzForce || showParticleAcceleration) &&
                      !hideFieldVectors
                    }
                    disabled={showParticleAcceleration || hideFieldVectors}
                    onChange={(e) => setShowLorentzForce(e.target.checked)}
                    aria-label={`Show Lorentz force (F) (and particle velocity u). Hot-key: ${hotkeys.oneKey.toggleF}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show Lorentz force{' '}
                  <MathJaxInline content={'\\( \\vec F \\)'} srOnlyText="(F)" />{' '}
                  (and{' '}
                  <MathJaxInline content={'\\( \\vec u \\)).'} srOnlyText="u" />{' '}
                  Hotkey: <kbd>{hotkeys.oneKey.toggleF}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={showARef}
                    type="checkbox"
                    checked={showParticleAcceleration && !hideFieldVectors}
                    disabled={hideFieldVectors}
                    onChange={(e) =>
                      setShowParticleAcceleration(e.target.checked)
                    }
                    aria-label={`Show particle acceleration (A) (and particle velocity u and Lorentz force F). Hot-key: ${hotkeys.oneKey.toggleA.toUpperCase()}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show particle acceleration{' '}
                  <MathJaxInline content={'\\( \\vec{a} \\)'} srOnlyText="a" />{' '}
                  (and{' '}
                  <MathJaxInline content={'\\( \\vec u \\)'} srOnlyText="u" />{' '}
                  and{' '}
                  <MathJaxInline content={'\\( \\vec F \\)).'} srOnlyText="F" />{' '}
                  Hotkey: <kbd>{hotkeys.oneKey.toggleA}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={showSRef}
                    type="checkbox"
                    checked={showPoynting && !hideFieldVectors}
                    disabled={hideFieldVectors}
                    onChange={(e) => setShowPoynting(e.target.checked)}
                    aria-label={`Show Poynting vector (S). Hot-key: ${hotkeys.oneKey.toggleS}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show Poynting vector{' '}
                  <MathJaxInline content={'\\( \\vec S \\).'} srOnlyText="S" />{' '}
                  Hotkey: <kbd>{hotkeys.oneKey.toggleS}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={showInvariantsRef}
                    type="checkbox"
                    checked={showInvariants && !hideFieldVectors}
                    disabled={hideFieldVectors}
                    onChange={(e) => setShowInvariants(e.target.checked)}
                    aria-label={`Show field-invariants overlay. Hot-key: ${hotkeys.oneKey.toggleInvariants}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show field-invariants overlay. Hotkey:{' '}
                  <kbd>{hotkeys.oneKey.toggleInvariants}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={hideEandBRef}
                    type="checkbox"
                    checked={hideFieldVectors}
                    onChange={(e) => setHideFieldVectors(e.target.checked)}
                    aria-label={`Hide fields E and B and all derived quantities. Hot-key: ${hotkeys.oneKey.toggleEandB}`}
                  />
                </span>
                <span aria-hidden="true">
                  Hide fields{' '}
                  <MathJaxInline content={'\\( \\vec E \\)'} srOnlyText="E" />{' '}
                  and{' '}
                  <MathJaxInline content={'\\( \\vec B \\)'} srOnlyText="B" />{' '}
                  and all derived quantities. Hotkey:{' '}
                  <kbd>{hotkeys.oneKey.toggleEandB}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={showCompsRef}
                    type="checkbox"
                    checked={showComponentVectors && !hideBoostedQuantities}
                    disabled={hideBoostedQuantities}
                    onChange={(e) => setShowComponentVectors(e.target.checked)}
                    aria-label={`Show components parallel and perpendicular to boost velocity (v). Hot-key: ${hotkeys.oneKey.toggleComps}`}
                  />
                </span>
                <span aria-hidden="true">
                  Show components parallel and perpendicular to boost velocity{' '}
                  <MathJaxInline content={'\\( \\vec v \\).'} srOnlyText="v" />{' '}
                  Hotkey: <kbd>{hotkeys.oneKey.toggleComps}</kbd>
                </span>
              </label>
            </div>

            <div>
              <label>
                <span>
                  <input
                    ref={hideVRef}
                    type="checkbox"
                    checked={hideBoostedQuantities}
                    onChange={(e) => setHideBoostedQuantities(e.target.checked)}
                    aria-label={`Hide boost velocity v, primed quantities, and components. Hot-key: ${hotkeys.oneKey.toggleV}`}
                  />
                </span>
                <span aria-hidden="true">
                  Hide boost velocity{' '}
                  <MathJaxInline content={'\\( \\vec v \\),'} srOnlyText="v" />{' '}
                  "primed" quantities, and components. Hotkey:{' '}
                  <kbd>{hotkeys.oneKey.toggleV}</kbd>
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="mt-3 flex flex-wrap gap-2">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (cameraRef.current) {
                      cameraRef.current.reset();
                      announceCameraReset();
                    }
                  }}
                  aria-label={`Reset camera. Hot-key: ${hotkeys.oneKey.resetCamera}`}
                >
                  <span aria-hidden="true">
                    Reset camera. Hotkey:{' '}
                    <kbd>{hotkeys.oneKey.resetCamera}</kbd>
                  </span>
                </button>
              </div>

              {(
                [
                  ['x', rotateX, hotkeys.oneKey.rotateFieldsX],
                  ['y', rotateY, hotkeys.oneKey.rotateFieldsY],
                  ['z', rotateZ, hotkeys.oneKey.rotateFieldsZ],
                ] as const
              ).map(([axis, handler, key]) => (
                <div key={axis}>
                  <button
                    type="button"
                    onClick={handler}
                    aria-label={`Rotate fields 90° around ${axis} axis. Hot-key: ${key}`}
                  >
                    <span aria-hidden="true">
                      Rotate fields 90° around{' '}
                      <MathJaxInline
                        content={`\\( ${axis} \\).`}
                        srOnlyText={axis}
                      />{' '}
                      Hotkey: <kbd>{key}</kbd>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </fieldset>
      </details>

      <details>
        <summary>Preset field configurations</summary>
        <div className="ml-4 mt-2 flex flex-wrap gap-2">
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, -2]);
                setBField([0, 0, 2]);
              }}
            >
              Antiparallel
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 2]);
                setBField([0, 0, 2]);
              }}
            >
              Equal
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 2]);
                setBField([0, -2, 0]);
              }}
            >
              Light
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, -2]);
                setBField([0, 0, 0]);
              }}
            >
              No magnetic
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([0, 0, 0]);
                setBField([0, 0, 2]);
              }}
            >
              No electric
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setEField([
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                ]);
                setBField([
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                  Math.random() * 2 * Math.sign(Math.random() - 0.5),
                ]);
              }}
            >
              Random
            </button>
          </div>
        </div>
      </details>
    </div>
  );
};

export default Options;
