import create from 'zustand';

export type CartesianComponents = [number, number, number];
export type SphericalComponents = [number, number, number];

export interface State {
  /** Cartesian components of the electric field vector in the original (unprimed) frame. */
  eField: CartesianComponents;
  /** Cartesian components of the magnetic field vector in the original (unprimed) frame. */
  bField: CartesianComponents;
  /** The boost velocity-vector. */
  boostVelocity: SphericalComponents;
  /** Velocity of a particle in the original (unprimed) frame. */
  particleVelocity: SphericalComponents;
  /** Charge of particle. */
  particleCharge: number;
  /** Mass of particle */
  particleMass: number;
  /** If `true`, component-vectors parallel and perpendicular to the boost-velocity will be displayed. */
  showComponentVectors: boolean;
  /** If `true`, the Poynting vector (in both frames) will be displayed. */
  showPoynting: boolean;
  /** If `true`, the particle-velocity will be displayed. */
  showParticleVelocity: boolean;
  /** If `true`, the Lorentz force acting on the particle (and the particle's velocity) will be displayed. */
  showLorentzForce: boolean;
  /** If `true`, the acceleration on the particle resulting from the Lorentz force will be displayed (as will the particle's velocity and the Lorentz force). */
  showParticleAcceleration: boolean;
  /** If `true`, will hide the boosted quantities (including the boost-vector). Helpful if interested in only single-frame relationships (declutters the screen). */
  hideBoostedQuantities: boolean;

  setEField: (newEField: State['eField']) => void;
  setEFieldX: (newEFieldX: State['eField'][number]) => void;
  setEFieldY: (newEFieldY: State['eField'][number]) => void;
  setEFieldZ: (newEFieldZ: State['eField'][number]) => void;

  setBField: (newBField: State['bField']) => void;
  setBFieldX: (newBFieldX: State['bField'][number]) => void;
  setBFieldY: (newBFieldY: State['bField'][number]) => void;
  setBFieldZ: (newBFieldZ: State['bField'][number]) => void;

  setBoostVelocity: (newBoostVelocity: State['boostVelocity']) => void;
  setBoostVelocityR: (
    newBoostVelocityR: State['boostVelocity'][number]
  ) => void;
  setBoostVelocityPhi: (
    newBoostVelocityPhi: State['boostVelocity'][number]
  ) => void;
  setBoostVelocityTheta: (
    newBoostVelocityTheta: State['boostVelocity'][number]
  ) => void;
  flipBoostVelocity: () => void;

  setParticleVelocity: (newParticleVelocity: State['particleVelocity']) => void;
  setParticleVelocityR: (
    newParticleVelocityR: State['particleVelocity'][number]
  ) => void;
  setParticleVelocityPhi: (
    newParticleVelocityPhi: State['particleVelocity'][number]
  ) => void;
  setParticleVelocityTheta: (
    newParticleVelocityTheta: State['particleVelocity'][number]
  ) => void;
  flipParticleVelocity: () => void;

  setParticleCharge: (newParticleCharge: State['particleCharge']) => void;
  setParticleMass: (newParticleMass: State['particleMass']) => void;

  setShowComponentVectors: (
    newShowComponentVectors: State['showComponentVectors']
  ) => void;
  setShowPoynting: (newShowPoynting: State['showPoynting']) => void;
  setShowParticleVelocity: (
    newShowParticleVelocity: State['showParticleVelocity']
  ) => void;
  setShowLorentzForce: (newShowLorentzForce: State['showLorentzForce']) => void;
  setShowParticleAcceleration: (
    newShowParticleAcceleration: State['showParticleAcceleration']
  ) => void;
  setHideBoostedQuantities: (
    newHideBoostedQuantities: State['hideBoostedQuantities']
  ) => void;
}

const useStore = create<State>()((set) => {
  return {
    eField: [1, 1, 1],
    bField: [-1, -1, -1],
    boostVelocity: [0.5, Math.PI / 2, Math.PI / 2],
    particleVelocity: [0.5, Math.PI / 4, -Math.PI / 4],
    particleCharge: 1,
    particleMass: 1,
    showComponentVectors: false,
    showPoynting: false,
    showParticleVelocity: false,
    showLorentzForce: false,
    showParticleAcceleration: false,
    hideBoostedQuantities: false,

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
    setBoostVelocityR: (newBoostVelocityR) =>
      set((state) => ({
        boostVelocity: [
          newBoostVelocityR,
          state.boostVelocity[1],
          state.boostVelocity[2],
        ],
      })),
    setBoostVelocityPhi: (newBoostVelocityPhi) =>
      set((state) => ({
        boostVelocity: [
          state.boostVelocity[0],
          newBoostVelocityPhi,
          state.boostVelocity[2],
        ],
      })),
    setBoostVelocityTheta: (newBoostVelocityTheta) =>
      set((state) => ({
        boostVelocity: [
          state.boostVelocity[0],
          state.boostVelocity[1],
          newBoostVelocityTheta,
        ],
      })),
    flipBoostVelocity: () =>
      set((state) => ({
        boostVelocity: [
          state.boostVelocity[0],
          state.boostVelocity[1] + Math.PI,
          state.boostVelocity[2],
        ],
      })),

    setParticleVelocity: (newParticleVelocity) =>
      set(() => ({ particleVelocity: newParticleVelocity })),
    setParticleVelocityR: (newParticleVelocityR) =>
      set((state) => ({
        particleVelocity: [
          newParticleVelocityR,
          state.particleVelocity[1],
          state.particleVelocity[2],
        ],
      })),
    setParticleVelocityPhi: (newParticleVelocityPhi) =>
      set((state) => ({
        particleVelocity: [
          state.particleVelocity[0],
          newParticleVelocityPhi,
          state.particleVelocity[2],
        ],
      })),
    setParticleVelocityTheta: (newParticleVelocityTheta) =>
      set((state) => ({
        particleVelocity: [
          state.particleVelocity[0],
          state.particleVelocity[1],
          newParticleVelocityTheta,
        ],
      })),
    flipParticleVelocity: () =>
      set((state) => ({
        particleVelocity: [
          state.particleVelocity[0],
          state.particleVelocity[1] + Math.PI,
          state.particleVelocity[2],
        ],
      })),

    setParticleCharge: (newParticleCharge) =>
      set(() => ({ particleCharge: newParticleCharge })),
    setParticleMass: (newParticleMass) =>
      set(() => ({ particleMass: newParticleMass })),

    setShowComponentVectors: (newShowComponentVectors) =>
      set(() => ({ showComponentVectors: newShowComponentVectors })),
    setShowPoynting: (newShowPoynting) =>
      set(() => ({ showPoynting: newShowPoynting })),
    setShowParticleVelocity: (newShowParticleVelocity) =>
      set(() => ({ showParticleVelocity: newShowParticleVelocity })),
    setShowLorentzForce: (newShowLorentzForce) =>
      set(() => ({ showLorentzForce: newShowLorentzForce })),
    setShowParticleAcceleration: (newParticleAcceleration) =>
      set(() => ({ showParticleAcceleration: newParticleAcceleration })),
    setHideBoostedQuantities: (newHideBoostedQuantities) =>
      set(() => ({ hideBoostedQuantities: newHideBoostedQuantities })),
  };
});

export default useStore;
