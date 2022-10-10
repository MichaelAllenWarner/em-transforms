import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import useStore, { CartesianComponents, State } from '../store/store';
import shallow from 'zustand/shallow';
import Vector from '../components/Vector';
import { OrbitControls } from 'three-stdlib';
import Axes from '../components/Axes';
import Head from 'next/head';
import * as THREE from 'three';
import Options from '../components/Options';
import VectorFieldset from '../components/VectorFieldset';
import { Color, textColor } from '../helpers/Color';
import VectorFieldsetSpherical from '../components/VectorFieldsetSpherical';
import TitleAndInstructions from '../components/TitleAndInstructions';
import { useHotkeys } from 'react-hotkeys-hook';

const cross = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents
): CartesianComponents => [
  a_y * b_z - b_y * a_z,
  a_z * b_x - b_z * a_x,
  a_x * b_y - b_x * a_y,
];
const dot = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents
) => a_x * b_x + a_y * b_y + a_z * b_z;

const boostVelocityVec = new THREE.Vector3();
const boostUnitVelocity = boostVelocityVec.clone();

const particleVelocityVec = new THREE.Vector3();
const particleVelocityPrimeVec = new THREE.Vector3();
const particleVelocityPrimeSpherical = new THREE.Spherical();

const storeSelector = (state: State) => ({
  eField: state.eField,
  bField: state.bField,
  boostVelocity: state.boostVelocity,
  particleVelocity: state.particleVelocity,
  particleCharge: state.particleCharge,
  particleMass: state.particleMass,
  setEFieldX: state.setEFieldX,
  setEFieldY: state.setEFieldY,
  setEFieldZ: state.setEFieldZ,
  setBFieldX: state.setBFieldX,
  setBFieldY: state.setBFieldY,
  setBFieldZ: state.setBFieldZ,
  setBoostVelocityR: state.setBoostVelocityR,
  setBoostVelocityPhi: state.setBoostVelocityPhi,
  setBoostVelocityTheta: state.setBoostVelocityTheta,
  flipBoostVelocity: state.flipBoostVelocity,
  setParticleVelocityR: state.setParticleVelocityR,
  setParticleVelocityPhi: state.setParticleVelocityPhi,
  setParticleVelocityTheta: state.setParticleVelocityTheta,
  flipParticleVelocity: state.flipParticleVelocity,
  setParticleCharge: state.setParticleCharge,
  setParticleMass: state.setParticleMass,
  showComponentVectors: state.showComponentVectors,
  showPoynting: state.showPoynting,
  showParticleVelocity: state.showParticleVelocity,
  showLorentzForce: state.showLorentzForce,
  showParticleAcceleration: state.showParticleAcceleration,
  hideBoostedQuantities: state.hideBoostedQuantities,
});

const calculateQuantities = ({
  boostVelocity,
  eField,
  bField,
  particleVelocity,
  particleCharge,
  particleMass,
}: {
  boostVelocity: State['boostVelocity'];
  eField: State['eField'];
  bField: State['bField'];
  particleVelocity: State['particleVelocity'];
  particleCharge: State['particleCharge'];
  particleMass: State['particleMass'];
}) => {
  const boostVelocityCartesian = boostVelocityVec
    .setFromSphericalCoords(...boostVelocity)
    .toArray();

  const boostUnit = boostUnitVelocity
    .set(...boostVelocityCartesian)
    .normalize()
    .toArray();

  const boostRapidity = Math.atanh(boostVelocityVec.length());
  const ch = Math.cosh(boostRapidity);
  const sh = Math.sinh(boostRapidity);
  const sh2 = 2 * Math.sinh(boostRapidity / 2) ** 2;
  const crossE = cross(boostUnit, eField);
  const crossB = cross(boostUnit, bField);
  const dotE = dot(boostUnit, eField);
  const dotB = dot(boostUnit, bField);

  const ePrime = eField.map(
    (comp, i) => ch * comp + sh * crossB[i] - sh2 * dotE * boostUnit[i]
  ) as CartesianComponents;
  const bPrime = bField.map(
    (comp, i) => ch * comp - sh * crossE[i] - sh2 * dotB * boostUnit[i]
  ) as CartesianComponents;

  const particleVelocityCartesian = particleVelocityVec
    .setFromSphericalCoords(...particleVelocity)
    .toArray();

  const dotU = dot(boostUnit, particleVelocityCartesian);

  const particleVelocityPrime = particleVelocityCartesian.map(
    (comp, i) => (comp + boostUnit[i] * (sh2 * dotU - sh)) / (ch - sh * dotU)
  ) as CartesianComponents;

  particleVelocityPrimeVec.set(...particleVelocityPrime);
  particleVelocityPrimeSpherical.setFromVector3(particleVelocityPrimeVec);

  const particleVelocityCrossB = cross(particleVelocityCartesian, bField);
  const particleVelocityCrossBPrime = cross(particleVelocityPrime, bPrime);

  const lorentzForce = eField.map(
    (comp, i) => particleCharge * (comp + particleVelocityCrossB[i])
  ) as CartesianComponents;
  const lorentzForcePrime = ePrime.map(
    (comp, i) => particleCharge * (comp + particleVelocityCrossBPrime[i])
  ) as CartesianComponents;

  const lorentzDotParticleVelocity = dot(
    lorentzForce,
    particleVelocityCartesian
  );
  const lorentzDotParticleVelocityPrime = dot(
    lorentzForcePrime,
    particleVelocityPrimeVec.toArray()
  );

  const particleRapidity = Math.atanh(particleVelocityVec.length());
  const particleRapidityPrime = Math.atanh(particleVelocityPrimeVec.length());

  const particleEnergy = Math.cosh(particleRapidity) * particleMass;
  const particleEnergyPrime = Math.cosh(particleRapidityPrime) * particleMass;

  const particleAcceleration = lorentzForce.map(
    (comp, i) =>
      (comp - lorentzDotParticleVelocity * particleVelocityCartesian[i]) /
      particleEnergy
  );
  const particleAccelerationPrime = lorentzForcePrime.map(
    (comp, i) =>
      (comp - lorentzDotParticleVelocityPrime * particleVelocityPrime[i]) /
      particleEnergyPrime
  );

  const poynting = cross(eField, bField);
  const poyntingPrime = cross(ePrime, bPrime);

  return {
    boostVelocityCartesian,
    boostUnit,
    ePrime,
    bPrime,
    particleVelocityCartesian,
    particleVelocityPrime,
    lorentzForce,
    lorentzForcePrime,
    particleAcceleration,
    particleAccelerationPrime,
    poynting,
    poyntingPrime,
  };
};

const axes = <Axes />;

const CameraController = forwardRef<OrbitControls | undefined>((_, ref) => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    if (ref && typeof ref !== 'function') {
      ref.current = controls;
    }
    return () => {
      controls.dispose();
    };
  }, [camera, gl, ref]);
  return null;
});
CameraController.displayName = 'CameraController';

const titleAndInstructions = <TitleAndInstructions />;

const inputEvent = new Event('input', { bubbles: true });

const Page = () => {
  const cameraRef = useRef<OrbitControls>();

  const {
    eField,
    bField,
    boostVelocity,
    particleVelocity,
    particleCharge,
    particleMass,
    setEFieldX,
    setEFieldY,
    setEFieldZ,
    setBFieldX,
    setBFieldY,
    setBFieldZ,
    setBoostVelocityR,
    setBoostVelocityPhi,
    setBoostVelocityTheta,
    flipBoostVelocity,
    setParticleVelocityR,
    setParticleVelocityPhi,
    setParticleVelocityTheta,
    flipParticleVelocity,
    setParticleCharge,
    setParticleMass,
    showComponentVectors,
    showPoynting,
    showParticleVelocity,
    showLorentzForce,
    showParticleAcceleration,
    hideBoostedQuantities,
  } = useStore(storeSelector, shallow);

  const {
    boostVelocityCartesian,
    boostUnit,
    ePrime,
    bPrime,
    particleVelocityCartesian,
    particleVelocityPrime,
    lorentzForce,
    lorentzForcePrime,
    particleAcceleration,
    particleAccelerationPrime,
    poynting,
    poyntingPrime,
  } = calculateQuantities({
    boostVelocity,
    eField,
    bField,
    particleVelocity,
    particleCharge,
    particleMass,
  });

  // set up camera-reset hotkey

  useHotkeys('k', () => {
    if (!cameraRef.current) return;
    cameraRef.current.reset();
  });

  // set up show/hide hotkeys

  const showCompsRef = useRef<HTMLInputElement | null>(null);
  const toggleComps = useCallback(() => {
    if (!showCompsRef.current || showCompsRef.current.disabled) return;
    showCompsRef.current.click();
  }, []);
  useHotkeys('c', toggleComps);

  const showSRef = useRef<HTMLInputElement | null>(null);
  const toggleS = useCallback(() => {
    if (!showSRef.current || showSRef.current.disabled) return;
    showSRef.current.click();
  }, []);
  useHotkeys('s', toggleS);

  const showURef = useRef<HTMLInputElement | null>(null);
  const toggleU = useCallback(() => {
    if (!showURef.current || showURef.current.disabled) return;
    showURef.current.click();
  }, []);
  useHotkeys('w', toggleU);

  const showFRef = useRef<HTMLInputElement | null>(null);
  const toggleF = useCallback(() => {
    if (!showFRef.current || showFRef.current.disabled) return;
    showFRef.current.click();
  }, []);
  useHotkeys('f', toggleF);

  const showARef = useRef<HTMLInputElement | null>(null);
  const toggleA = useCallback(() => {
    if (!showARef.current || showARef.current.disabled) return;
    showARef.current.click();
  }, []);
  useHotkeys('a', toggleA);

  const hideVRef = useRef<HTMLInputElement | null>(null);
  const toggleV = useCallback(() => {
    if (!hideVRef.current || hideVRef.current.disabled) return;
    hideVRef.current.click();
  }, []);
  useHotkeys('h', toggleV);

  // set up E hotkeys

  const eXRef = useRef<HTMLInputElement | null>(null);
  const eXUp = useCallback((event: KeyboardEvent) => {
    if (!eXRef.current) return;
    event.preventDefault();
    eXRef.current.stepUp();
    eXRef.current.dispatchEvent(inputEvent);
  }, []);
  const eXDown = useCallback((event: KeyboardEvent) => {
    if (!eXRef.current) return;
    event.preventDefault();
    eXRef.current.stepDown();
    eXRef.current.dispatchEvent(inputEvent);
  }, []);

  const eYRef = useRef<HTMLInputElement | null>(null);
  const eYUp = useCallback((event: KeyboardEvent) => {
    if (!eYRef.current) return;
    event.preventDefault();
    eYRef.current.stepUp();
    eYRef.current.dispatchEvent(inputEvent);
  }, []);
  const eYDown = useCallback((event: KeyboardEvent) => {
    if (!eYRef.current) return;
    event.preventDefault();
    eYRef.current.stepDown();
    eYRef.current.dispatchEvent(inputEvent);
  }, []);

  const eZRef = useRef<HTMLInputElement | null>(null);
  const eZUp = useCallback((event: KeyboardEvent) => {
    if (!eZRef.current) return;
    event.preventDefault();
    eZRef.current.stepUp();
    eZRef.current.dispatchEvent(inputEvent);
  }, []);
  const eZDown = useCallback((event: KeyboardEvent) => {
    if (!eZRef.current) return;
    event.preventDefault();
    eZRef.current.stepDown();
    eZRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('e+x+up', eXUp);
  useHotkeys('e+x+down', eXDown);
  useHotkeys('e+y+up', eYUp);
  useHotkeys('e+y+down', eYDown);
  useHotkeys('e+z+up', eZUp);
  useHotkeys('e+z+down', eZDown);

  // set up B hotkeys

  const bXRef = useRef<HTMLInputElement | null>(null);
  const bXUp = useCallback((event: KeyboardEvent) => {
    if (!bXRef.current) return;
    event.preventDefault();
    bXRef.current.stepUp();
    bXRef.current.dispatchEvent(inputEvent);
  }, []);
  const bXDown = useCallback((event: KeyboardEvent) => {
    if (!bXRef.current) return;
    event.preventDefault();
    bXRef.current.stepDown();
    bXRef.current.dispatchEvent(inputEvent);
  }, []);

  const bYRef = useRef<HTMLInputElement | null>(null);
  const bYUp = useCallback((event: KeyboardEvent) => {
    if (!bYRef.current) return;
    event.preventDefault();
    bYRef.current.stepUp();
    bYRef.current.dispatchEvent(inputEvent);
  }, []);
  const bYDown = useCallback((event: KeyboardEvent) => {
    if (!bYRef.current) return;
    event.preventDefault();
    bYRef.current.stepDown();
    bYRef.current.dispatchEvent(inputEvent);
  }, []);

  const bZRef = useRef<HTMLInputElement | null>(null);
  const bZUp = useCallback((event: KeyboardEvent) => {
    if (!bZRef.current) return;
    event.preventDefault();
    bZRef.current.stepUp();
    bZRef.current.dispatchEvent(inputEvent);
  }, []);
  const bZDown = useCallback((event: KeyboardEvent) => {
    if (!bZRef.current) return;
    event.preventDefault();
    bZRef.current.stepDown();
    bZRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('b+x+up', bXUp);
  useHotkeys('b+x+down', bXDown);
  useHotkeys('b+y+up', bYUp);
  useHotkeys('b+y+down', bYDown);
  useHotkeys('b+z+up', bZUp);
  useHotkeys('b+z+down', bZDown);

  // set up v hotkeys (boost velocity)

  const vRRef = useRef<HTMLInputElement | null>(null);
  const vRUp = useCallback((event: KeyboardEvent) => {
    if (!vRRef.current) return;
    event.preventDefault();
    vRRef.current.stepUp();
    vRRef.current.dispatchEvent(inputEvent);
  }, []);
  const vRDown = useCallback((event: KeyboardEvent) => {
    if (!vRRef.current) return;
    event.preventDefault();
    vRRef.current.stepDown();
    vRRef.current.dispatchEvent(inputEvent);
  }, []);

  const vPhiRef = useRef<HTMLInputElement | null>(null);
  const vPhiUp = useCallback((event: KeyboardEvent) => {
    if (!vPhiRef.current) return;
    event.preventDefault();
    vPhiRef.current.stepUp();
    vPhiRef.current.dispatchEvent(inputEvent);
  }, []);
  const vPhiDown = useCallback((event: KeyboardEvent) => {
    if (!vPhiRef.current) return;
    event.preventDefault();
    vPhiRef.current.stepDown();
    vPhiRef.current.dispatchEvent(inputEvent);
  }, []);

  const vThetaRef = useRef<HTMLInputElement | null>(null);
  const vThetaUp = useCallback((event: KeyboardEvent) => {
    if (!vThetaRef.current) return;
    event.preventDefault();
    vThetaRef.current.stepUp();
    vThetaRef.current.dispatchEvent(inputEvent);
  }, []);
  const vThetaDown = useCallback((event: KeyboardEvent) => {
    if (!vThetaRef.current) return;
    event.preventDefault();
    vThetaRef.current.stepDown();
    vThetaRef.current.dispatchEvent(inputEvent);
  }, []);

  const vResetRef = useRef<HTMLButtonElement | null>(null);
  const vReset = useCallback(() => {
    if (!vResetRef.current) return;
    vResetRef.current.click();
  }, []);

  useHotkeys('v+r+up', vRUp);
  useHotkeys('v+r+down', vRDown);
  useHotkeys('v+p+up', vPhiUp);
  useHotkeys('v+p+down', vPhiDown);
  useHotkeys('v+t+up', vThetaUp);
  useHotkeys('v+t+down', vThetaDown);
  useHotkeys('v+0', vReset);
  useHotkeys('v+-', flipBoostVelocity);

  // set up u hotkeys (particle velocity)

  const uRRef = useRef<HTMLInputElement | null>(null);
  const uRUp = useCallback((event: KeyboardEvent) => {
    if (!uRRef.current) return;
    event.preventDefault();
    uRRef.current.stepUp();
    uRRef.current.dispatchEvent(inputEvent);
  }, []);
  const uRDown = useCallback((event: KeyboardEvent) => {
    if (!uRRef.current) return;
    event.preventDefault();
    uRRef.current.stepDown();
    uRRef.current.dispatchEvent(inputEvent);
  }, []);

  const uPhiRef = useRef<HTMLInputElement | null>(null);
  const uPhiUp = useCallback((event: KeyboardEvent) => {
    if (!uPhiRef.current) return;
    event.preventDefault();
    uPhiRef.current.stepUp();
    uPhiRef.current.dispatchEvent(inputEvent);
  }, []);
  const uPhiDown = useCallback((event: KeyboardEvent) => {
    if (!uPhiRef.current) return;
    event.preventDefault();
    uPhiRef.current.stepDown();
    uPhiRef.current.dispatchEvent(inputEvent);
  }, []);

  const uThetaRef = useRef<HTMLInputElement | null>(null);
  const uThetaUp = useCallback((event: KeyboardEvent) => {
    if (!uThetaRef.current) return;
    event.preventDefault();
    uThetaRef.current.stepUp();
    uThetaRef.current.dispatchEvent(inputEvent);
  }, []);
  const uThetaDown = useCallback((event: KeyboardEvent) => {
    if (!uThetaRef.current) return;
    event.preventDefault();
    uThetaRef.current.stepDown();
    uThetaRef.current.dispatchEvent(inputEvent);
  }, []);

  const uResetRef = useRef<HTMLButtonElement | null>(null);
  const uReset = useCallback(() => {
    if (!uResetRef.current) return;
    uResetRef.current.click();
  }, []);

  useHotkeys('u+r+up', uRUp);
  useHotkeys('u+r+down', uRDown);
  useHotkeys('u+p+up', uPhiUp);
  useHotkeys('u+p+down', uPhiDown);
  useHotkeys('u+t+up', uThetaUp);
  useHotkeys('u+t+down', uThetaDown);
  useHotkeys('u+0', uReset);
  useHotkeys('u+-', flipParticleVelocity);

  // set up hotkeys for particle charge

  const qRef = useRef<HTMLInputElement | null>(null);
  const qUp = useCallback((event: KeyboardEvent) => {
    if (!qRef.current) return;
    event.preventDefault();
    qRef.current.stepUp();
    qRef.current.dispatchEvent(inputEvent);
  }, []);
  const qDown = useCallback((event: KeyboardEvent) => {
    if (!qRef.current) return;
    event.preventDefault();
    qRef.current.stepDown();
    qRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('q+up', qUp);
  useHotkeys('q+down', qDown);

  // set up hotkeys for particle mass

  const mRef = useRef<HTMLInputElement | null>(null);
  const mUp = useCallback((event: KeyboardEvent) => {
    if (!mRef.current) return;
    event.preventDefault();
    mRef.current.stepUp();
    mRef.current.dispatchEvent(inputEvent);
  }, []);
  const mDown = useCallback((event: KeyboardEvent) => {
    if (!mRef.current) return;
    event.preventDefault();
    mRef.current.stepDown();
    mRef.current.dispatchEvent(inputEvent);
  }, []);

  useHotkeys('m+up', mUp);
  useHotkeys('m+down', mDown);

  return (
    <>
      <Head>
        <title>
          Lorentz Transformation of the Electric and Magnetic Fields, Visualized
        </title>
      </Head>
      <main className="container mt-10 flex h-screen w-screen flex-col space-y-10">
        {titleAndInstructions}

        <Canvas className="max-h-screen min-h-[600px] flex-1 px-6 [&>*]:border">
          <CameraController ref={cameraRef} />
          <ambientLight />

          {axes}

          <Vector
            x={eField[0]}
            y={eField[1]}
            z={eField[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.E}
            label="E"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
          />

          <Vector
            x={bField[0]}
            y={bField[1]}
            z={bField[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.B}
            label="B"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
          />

          <Vector
            x={particleVelocityCartesian[0]}
            y={particleVelocityCartesian[1]}
            z={particleVelocityCartesian[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.U}
            label="u"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={
              !showParticleVelocity &&
              !showLorentzForce &&
              !showParticleAcceleration
            }
          />

          <Vector
            x={particleVelocityPrime[0]}
            y={particleVelocityPrime[1]}
            z={particleVelocityPrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.UPrime}
            label="u′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={
              (!showParticleVelocity &&
                !showLorentzForce &&
                !showParticleAcceleration) ||
              hideBoostedQuantities
            }
          />

          <Vector
            x={lorentzForce[0]}
            y={lorentzForce[1]}
            z={lorentzForce[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.F}
            label="F"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showLorentzForce && !showParticleAcceleration}
          />

          <Vector
            x={lorentzForcePrime[0]}
            y={lorentzForcePrime[1]}
            z={lorentzForcePrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.FPrime}
            label="F′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={
              (!showLorentzForce && !showParticleAcceleration) ||
              hideBoostedQuantities
            }
          />

          <Vector
            x={particleAcceleration[0]}
            y={particleAcceleration[1]}
            z={particleAcceleration[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.A}
            label="a"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showParticleAcceleration}
          />

          <Vector
            x={particleAccelerationPrime[0]}
            y={particleAccelerationPrime[1]}
            z={particleAccelerationPrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.APrime}
            label="a′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showParticleAcceleration || hideBoostedQuantities}
          />

          <Vector
            x={boostVelocityCartesian[0]}
            y={boostVelocityCartesian[1]}
            z={boostVelocityCartesian[2]}
            color={Color.V}
            label="v"
            hide={hideBoostedQuantities}
          />

          <Vector
            x={ePrime[0]}
            y={ePrime[1]}
            z={ePrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.EPrime}
            label="E′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={hideBoostedQuantities}
          />

          <Vector
            x={bPrime[0]}
            y={bPrime[1]}
            z={bPrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.BPrime}
            label="B′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={hideBoostedQuantities}
          />

          <Vector
            x={poynting[0]}
            y={poynting[1]}
            z={poynting[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.S}
            label="S"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showPoynting}
          />

          <Vector
            x={poyntingPrime[0]}
            y={poyntingPrime[1]}
            z={poyntingPrime[2]}
            boostUnitX={boostUnit[0]}
            boostUnitY={boostUnit[1]}
            boostUnitZ={boostUnit[2]}
            color={Color.SPrime}
            label="S′"
            showComponentVectors={
              showComponentVectors && !hideBoostedQuantities
            }
            hide={!showPoynting || hideBoostedQuantities}
          />
        </Canvas>

        <form
          className="flex flex-wrap gap-8 pb-10"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Options
            cameraRef={cameraRef}
            vResetRef={vResetRef}
            uResetRef={uResetRef}
            showCompsRef={showCompsRef}
            showSRef={showSRef}
            showURef={showURef}
            showFRef={showFRef}
            showARef={showARef}
            hideVRef={hideVRef}
          />

          <VectorFieldsetSpherical
            color={Color.V}
            legend="Boost velocity (v)"
            r={boostVelocity[0]}
            phi={boostVelocity[1]}
            theta={boostVelocity[2]}
            rSetter={setBoostVelocityR}
            phiSetter={setBoostVelocityPhi}
            thetaSetter={setBoostVelocityTheta}
            rRef={vRRef}
            phiRef={vPhiRef}
            thetaRef={vThetaRef}
            isVelocity
            flipper={flipBoostVelocity}
            x={boostVelocityCartesian[0]}
            y={boostVelocityCartesian[1]}
            z={boostVelocityCartesian[2]}
          />

          <VectorFieldset
            color={Color.E}
            legend="Original electric field (E)"
            x={eField[0]}
            y={eField[1]}
            z={eField[2]}
            step="0.1"
            xSetter={setEFieldX}
            ySetter={setEFieldY}
            zSetter={setEFieldZ}
            xRef={eXRef}
            yRef={eYRef}
            zRef={eZRef}
          />

          <VectorFieldset
            color={Color.B}
            legend="Original magnetic field (B)"
            x={bField[0]}
            y={bField[1]}
            z={bField[2]}
            step="0.1"
            xSetter={setBFieldX}
            ySetter={setBFieldY}
            zSetter={setBFieldZ}
            xRef={bXRef}
            yRef={bYRef}
            zRef={bZRef}
          />

          <VectorFieldsetSpherical
            color={Color.U}
            legend="Original particle velocity (u)"
            r={particleVelocity[0]}
            phi={particleVelocity[1]}
            theta={particleVelocity[2]}
            rRef={uRRef}
            phiRef={uPhiRef}
            thetaRef={uThetaRef}
            isVelocity
            rSetter={setParticleVelocityR}
            phiSetter={setParticleVelocityPhi}
            thetaSetter={setParticleVelocityTheta}
            flipper={flipParticleVelocity}
            x={particleVelocityCartesian[0]}
            y={particleVelocityCartesian[1]}
            z={particleVelocityCartesian[2]}
          />

          <fieldset className={textColor[Color.U]}>
            <legend>Particle charge and mass</legend>
            <div>
              <label>
                Charge (q)
                <input
                  ref={qRef}
                  type="number"
                  step="0.1"
                  value={particleCharge}
                  onChange={(e) => {
                    let n = e.target.valueAsNumber;
                    if (isNaN(n)) n = 1;
                    setParticleCharge(n);
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Mass (m)
                <input
                  ref={mRef}
                  type="number"
                  step="0.1"
                  value={particleMass}
                  onChange={(e) => {
                    let n = e.target.valueAsNumber;
                    if (n <= 0) n = 0.1;
                    if (isNaN(n)) n = 1;
                    setParticleMass(n);
                  }}
                />
              </label>
            </div>
          </fieldset>

          <VectorFieldset
            color={Color.S}
            legend="Original Poynting vector (S)"
            x={poynting[0]}
            y={poynting[1]}
            z={poynting[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldset
            color={Color.F}
            legend="Original Lorentz force (F)"
            x={lorentzForce[0]}
            y={lorentzForce[1]}
            z={lorentzForce[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldset
            color={Color.A}
            legend="Original particle acceleration (a)"
            x={particleAcceleration[0]}
            y={particleAcceleration[1]}
            z={particleAcceleration[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldset
            color={Color.EPrime}
            legend="Boosted electric field (E′)"
            x={ePrime[0]}
            y={ePrime[1]}
            z={ePrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />

          <VectorFieldset
            color={Color.BPrime}
            legend="Boosted magnetic field (B′)"
            x={bPrime[0]}
            y={bPrime[1]}
            z={bPrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />

          <VectorFieldsetSpherical
            color={Color.UPrime}
            legend="Boosted particle velocity (u′)"
            r={particleVelocityPrimeSpherical.radius}
            phi={particleVelocityPrimeSpherical.phi}
            theta={particleVelocityPrimeSpherical.theta}
            isVelocity
            rDisabled
            phiDisabled
            thetaDisabled
            isPrime
            x={particleVelocityPrime[0]}
            y={particleVelocityPrime[1]}
            z={particleVelocityPrime[2]}
          />

          <VectorFieldset
            color={Color.SPrime}
            legend="Boosted Poynting vector (S′)"
            x={poyntingPrime[0]}
            y={poyntingPrime[1]}
            z={poyntingPrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />

          <VectorFieldset
            color={Color.FPrime}
            legend="Boosted Lorentz force (F′)"
            x={lorentzForcePrime[0]}
            y={lorentzForcePrime[1]}
            z={lorentzForcePrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />

          <VectorFieldset
            color={Color.APrime}
            legend="Boosted particle acceleration (a′)"
            x={particleAccelerationPrime[0]}
            y={particleAccelerationPrime[1]}
            z={particleAccelerationPrime[2]}
            xDisabled
            yDisabled
            zDisabled
            isPrime
          />
        </form>
      </main>
    </>
  );
};

export default Page;
