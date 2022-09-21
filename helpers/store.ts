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
  setBField: (newBField: State['bField']) => void;
  setBoostVelocity: (newBoostVelocity: State['boostVelocity']) => void;
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
    setBField: (newBField) => set(() => ({ bField: newBField })),
    setBoostVelocity: (newBoostVelocity) =>
      set(() => ({ boostVelocity: newBoostVelocity })),
    setShowComponentVectors: (newShowComponentVectors) =>
      set(() => ({ showComponentVectors: newShowComponentVectors })),
    setShowPoynting: (newShowPoynting) =>
      set(() => ({ showPoynting: newShowPoynting })),
  };
});

export default useStore;
