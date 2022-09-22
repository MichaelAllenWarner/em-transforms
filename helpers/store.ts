import create from 'zustand';

export type CartesianComponents = [number, number, number];

export interface State {
  /** Cartesian components of the electric field vector in the original (unprimed) frame. */
  eField: CartesianComponents;
  /** Cartesian components of the magnetic field vector in the original (unprimed) frame. */
  bField: CartesianComponents;
  /** The boost velocity-vector (for now, the y- and z-components will always be 0). */
  boostVelocity: CartesianComponents;
  /** If `true`, component-vectors parallel and perpendicular to the boost-velocity will be displayed. */
  showComponentVectors: boolean;
  /** If `true`, the Poynting vector (in both frames) will be displayed. */
  showPoynting: boolean;

  setEField: (newEField: State['eField']) => void;
  setEFieldX: (newEFieldX: State['eField'][number]) => void;
  setEFieldY: (newEFieldY: State['eField'][number]) => void;
  setEFieldZ: (newEFieldZ: State['eField'][number]) => void;

  setBField: (newBField: State['bField']) => void;
  setBFieldX: (newBFieldX: State['bField'][number]) => void;
  setBFieldY: (newBFieldY: State['bField'][number]) => void;
  setBFieldZ: (newBFieldZ: State['bField'][number]) => void;

  setBoostVelocity: (newBoostVelocity: State['boostVelocity']) => void;
  setBoostVelocityX: (
    newBoostVelocityX: State['boostVelocity'][number]
  ) => void;
  setBoostVelocityY: (
    newBoostVelocityY: State['boostVelocity'][number]
  ) => void;
  setBoostVelocityZ: (
    newBoostVelocityZ: State['boostVelocity'][number]
  ) => void;

  setShowComponentVectors: (
    newShowComponentVectors: State['showComponentVectors']
  ) => void;
  setShowPoynting: (newShowPoynting: State['showPoynting']) => void;
}

const useStore = create<State>()((set) => {
  return {
    eField: [1, 1, 1],
    bField: [-1, -1, -1],
    boostVelocity: [0.5, 0, 0],
    showComponentVectors: false,
    showPoynting: false,

    setEField: (newEField) => set(() => ({ eField: newEField })),
    setEFieldX: (newEFieldX) =>
      set((state) => ({
        eField: [newEFieldX, state.eField[1], state.eField[2]],
      })),
    setEFieldY: (newEFieldY) =>
      set((state) => ({
        eField: [state.eField[0], newEFieldY, state.eField[2]],
      })),
    setEFieldZ: (newEFieldZ) =>
      set((state) => ({
        eField: [state.eField[0], state.eField[1], newEFieldZ],
      })),

    setBField: (newBField) => set(() => ({ bField: newBField })),
    setBFieldX: (newBFieldX) =>
      set((state) => ({
        bField: [newBFieldX, state.bField[1], state.bField[2]],
      })),
    setBFieldY: (newBFieldY) =>
      set((state) => ({
        bField: [state.bField[0], newBFieldY, state.bField[2]],
      })),
    setBFieldZ: (newBFieldZ) =>
      set((state) => ({
        bField: [state.bField[0], state.bField[1], newBFieldZ],
      })),

    setBoostVelocity: (newBoostVelocity) =>
      set(() => ({ boostVelocity: newBoostVelocity })),
    setBoostVelocityX: (newBoostVelocityX) =>
      set((state) => ({
        boostVelocity: [
          newBoostVelocityX,
          state.boostVelocity[1],
          state.boostVelocity[2],
        ],
      })),
    setBoostVelocityY: (newBoostVelocityY) =>
      set((state) => ({
        boostVelocity: [
          state.boostVelocity[0],
          newBoostVelocityY,
          state.boostVelocity[2],
        ],
      })),
    setBoostVelocityZ: (newBoostVelocityZ) =>
      set((state) => ({
        boostVelocity: [
          state.boostVelocity[0],
          state.boostVelocity[1],
          newBoostVelocityZ,
        ],
      })),

    setShowComponentVectors: (newShowComponentVectors) =>
      set(() => ({ showComponentVectors: newShowComponentVectors })),
    setShowPoynting: (newShowPoynting) =>
      set(() => ({ showPoynting: newShowPoynting })),
  };
});

export default useStore;
