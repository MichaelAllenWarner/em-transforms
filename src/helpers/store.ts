import create from 'zustand'

export type CartesianComponents = [number, number, number]

export interface State {
  /** Cartesian components of the electric field vector in the original (unprimed) frame. */
  eField: CartesianComponents
  /** Cartesian components of the magnetic field vector in the original (unprimed) frame. */
  bField: CartesianComponents
  /**
   * Cartesian components of the primed frame's normalized velocity vector with respect to the unprimed frame.
   * The vector's magnitude must be >= 0 and < 1.
   */
  boost: CartesianComponents
  setEField: (newEField: State['eField']) => void
  setBField: (newBField: State['bField']) => void
  setBoost: (newBoost: State['boost']) => void
}

const useStore = create<State>()((set) => {
  return {
    eField: [1, 1, 1],
    bField: [-1, -1, -1],
    boost: [0.25, -0.25, 0.25],
    setEField: (newEField) => set(() => ({ eField: newEField })),
    setBField: (newBField) => set(() => ({ bField: newBField })),
    setBoost: (newBoost) => set(() => ({ boost: newBoost })),
  }
})

export default useStore
