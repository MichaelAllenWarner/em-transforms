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
    setShowComponentVectors,
    setShowPoynting,
    setEField,
    setBField,
  } = useStore(
    (state) => ({
      showComponentVectors: state.showComponentVectors,
      setShowComponentVectors: state.setShowComponentVectors,
      showPoynting: state.showPoynting,
      setShowPoynting: state.setShowPoynting,
      setEField: state.setEField,
      setBField: state.setBField,
    }),
    shallow
  );

  return (
    <fieldset className="w-full">
      <legend>Options</legend>
      <label>
        <input
          type="checkbox"
          checked={showComponentVectors}
          onChange={(e) => setShowComponentVectors(e.target.checked)}
        />
        Show component-vectors parallel and perpendicular to boost-velocity.
      </label>
      <label>
        <input
          type="checkbox"
          checked={showPoynting}
          onChange={(e) => setShowPoynting(e.target.checked)}
        />
        Show the Poynting vector in both frames (S = E x B).
      </label>
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
        <summary className="mt-2">
          Some interesting preset configurations
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
