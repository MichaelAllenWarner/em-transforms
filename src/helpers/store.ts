import create from 'zustand'

export type CartesianComponents = [number, number, number]

export interface State {
  /** Cartesian components of the electric field vector in the original (unprimed) frame. */
  eField: CartesianComponents
  /** Cartesian components of the magnetic field vector in the original (unprimed) frame. */
  bField: CartesianComponents
  /* The (signed) rapidity of the boost-vector, which is always along the x-axis. */
  boostRapidity: number
  setEField: (newEField: State['eField']) => void
  setBField: (newBField: State['bField']) => void
  setBoostRapidity: (newBoostRapidity: State['boostRapidity']) => void
}

const useStore = create<State>()((set) => {
  return {
    eField: [1, 1, 1],
    bField: [-1, -1, -1],
    boostRapidity: 0.8,
    setEField: (newEField) => set(() => ({ eField: newEField })),
    setBField: (newBField) => set(() => ({ bField: newBField })),
    setBoostRapidity: (newBoostRapidity) =>
      set(() => ({ boostRapidity: newBoostRapidity })),
  }
})

export default useStore
