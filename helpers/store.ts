import create from 'zustand';

export type CartesianComponents = [number, number, number];

export interface State {
  /** Cartesian components of the electric field vector in the original (unprimed) frame. */
  eField: CartesianComponents;
  /** Cartesian components of the magnetic field vector in the original (unprimed) frame. */
  bField: CartesianComponents;
  /* The x-component of the boost velocity-vector (y- and z-components are always 0). */
  boostVelocityX: number;
  setEField: (newEField: State['eField']) => void;
  setBField: (newBField: State['bField']) => void;
  setBoostVelocityX: (newBoostVelocityX: State['boostVelocityX']) => void;
}

const useStore = create<State>()((set) => {
  return {
    eField: [1, 1, 1],
    bField: [-1, -1, -1],
    boostVelocityX: 0.5,
    setEField: (newEField) => set(() => ({ eField: newEField })),
    setBField: (newBField) => set(() => ({ bField: newBField })),
    setBoostVelocityX: (newBoostVelocityX) =>
      set(() => ({ boostVelocityX: newBoostVelocityX })),
  };
});

export default useStore;
