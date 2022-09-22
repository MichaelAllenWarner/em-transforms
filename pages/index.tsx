/* eslint-disable react/no-unescaped-entities */
import { forwardRef, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import useStore, { CartesianComponents } from '../helpers/store';
import shallow from 'zustand/shallow';
import Vector from '../components/Vector';
import { OrbitControls } from 'three-stdlib';
import Axes from '../components/Axes';
import Head from 'next/head';
import * as THREE from 'three';
import Options from '../components/Options';
import VectorFieldSet from '../components/VectorFieldset';
import { Color } from '../helpers/Color';

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

const instructions = (
  <div className="space-y-10">
    <h1 className="text-2xl sm:text-3xl">
      Lorentz Transformation of the Electric and Magnetic Fields, Visualized
    </h1>
    <details>
      <summary>Instructions</summary>
      <div className="max-w-prose space-y-3 p-4">
        <p>
          This visualization demonstrates how the electric and magnetic fields
          transform under a Lorentz boost.
        </p>
        <p>
          Use the inputs below the visualization to set the Cartesian components
          of the electric- and magnetic-field vectors in the original "unprimed"
          frame, as well as (the x-component of) the boost-velocity. The
          electric- and magnetic-field vectors in the "primed" frame are
          calculated and rendered automatically.
        </p>
        <p>
          The inputs can only accept number-values, even while you're typing the
          number. Since a minus-sign by itself isn't interpreted as a number,
          entering a negative number is a bit cumbersome: you have to type at
          least one digit <em>before</em> inserting the minus sign at the start.
          Sorry about that.
        </p>
        <p>
          Electric and magnetic fields are measured in the same unit. The
          boost-speed is normalized (i.e., it's given as a fraction of the speed
          of light and must be less than 1). Finally, the Cartesian axes and
          their labels are fixed; perhaps in the future I'll make them
          adjustable or have them adapt to the vectors in the space.
        </p>
        <p>Here is how the "camera" works:</p>
        <ul className="ml-4 list-disc">
          <li>
            To orbit, use the left mouse-button (or one-finger move for touch).
          </li>
          <li>
            To zoom, use the mousewheel or the middle mouse-button (or
            two-finger spread/squish for touch).
          </li>
          <li>
            To pan, use the right mouse-button (or two-finger move for touch).
            Panning will change the focal point for orbiting and zooming, but
            you can restore it with the "Reset Camera" button below the
            visualization.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

const Page = () => {
  const cameraRef = useRef<OrbitControls>();

  const {
    eField,
    bField,
    boostVelocity,
    setEFieldX,
    setEFieldY,
    setEFieldZ,
    setBFieldX,
    setBFieldY,
    setBFieldZ,
    setBoostVelocityX,
    showComponentVectors,
    showPoynting,
  } = useStore(
    (state) => ({
      eField: state.eField,
      bField: state.bField,
      boostVelocity: state.boostVelocity,
      setEField: state.setEField,
      setEFieldX: state.setEFieldX,
      setEFieldY: state.setEFieldY,
      setEFieldZ: state.setEFieldZ,
      setBField: state.setBField,
      setBFieldX: state.setBFieldX,
      setBFieldY: state.setBFieldY,
      setBFieldZ: state.setBFieldZ,
      setBoostVelocity: state.setBoostVelocity,
      setBoostVelocityX: state.setBoostVelocityX,
      showComponentVectors: state.showComponentVectors,
      showPoynting: state.showPoynting,
    }),
    shallow
  );

  boostVelocityVec.set(boostVelocity[0], 0, 0);
  boostUnitVelocity.set(boostVelocity[0], 0, 0).normalize();

  const boostUnit = [
    boostUnitVelocity.x,
    boostUnitVelocity.y,
    boostUnitVelocity.z,
  ] as CartesianComponents;

  const boostRapidity = Math.atanh(boostVelocityVec.length());
  const ch = Math.cosh(boostRapidity);
  const sh = Math.sinh(boostRapidity);
  const sh2 = Math.sinh(boostRapidity / 2) ** 2;
  const crossE = cross(boostUnit, eField);
  const crossB = cross(boostUnit, bField);
  const dotE = dot(boostUnit, eField);
  const dotB = dot(boostUnit, bField);

  const ePrime = eField.map(
    (comp, i) => ch * comp + sh * crossB[i] - 2 * sh2 * dotE * boostUnit[i]
  ) as CartesianComponents;
  const bPrime = bField.map(
    (comp, i) => ch * comp - sh * crossE[i] - 2 * sh2 * dotB * boostUnit[i]
  ) as CartesianComponents;

  const poynting = cross(eField, bField);
  const poyntingPrime = cross(ePrime, bPrime);

  return (
    <>
      <Head>
        <title>
          Lorentz Transformation of the Electric and Magnetic Fields, Visualized
        </title>
      </Head>
      <main className="container mt-10 flex h-screen w-screen flex-col space-y-10">
        {instructions}

        <Canvas className="max-h-screen min-h-[600px] flex-1 px-6 [&>*]:border">
          <CameraController ref={cameraRef} />
          <ambientLight />

          {axes}

          <Vector
            x={eField[0]}
            y={eField[1]}
            z={eField[2]}
            color={Color.E}
            label="E"
            showComponentVectors={showComponentVectors}
          />

          <Vector
            x={bField[0]}
            y={bField[1]}
            z={bField[2]}
            color={Color.B}
            label="B"
            showComponentVectors={showComponentVectors}
          />

          <Vector x={boostVelocity[0]} y={0} z={0} color={Color.V} label="v" />

          <Vector
            x={ePrime[0]}
            y={ePrime[1]}
            z={ePrime[2]}
            color={Color.EPrime}
            label="E′"
            showComponentVectors={showComponentVectors}
          />

          <Vector
            x={bPrime[0]}
            y={bPrime[1]}
            z={bPrime[2]}
            color={Color.BPrime}
            label="B′"
            showComponentVectors={showComponentVectors}
          />

          <Vector
            x={poynting[0]}
            y={poynting[1]}
            z={poynting[2]}
            color={Color.S}
            label="S"
            showComponentVectors={showComponentVectors}
            hide={!showPoynting}
          />

          <Vector
            x={poyntingPrime[0]}
            y={poyntingPrime[1]}
            z={poyntingPrime[2]}
            color={Color.SPrime}
            label="S′"
            showComponentVectors={showComponentVectors}
            hide={!showPoynting}
          />
        </Canvas>

        <form
          className="flex flex-wrap gap-8 pb-10 [&_input]:ml-3 [&_input]:border [&_legend]:text-xl [&_fieldset]:flex [&_fieldset]:flex-col [&_fieldset]:space-y-2 [&_[type=checkbox]]:ml-0 [&_[type=checkbox]]:mr-3 [&_button]:rounded [&_button]:bg-stone-600 [&_button]:py-2 [&_button]:px-3 [&_button]:text-white [&_button]:transition-colors hover:[&_button]:bg-stone-600/[.85] focus-visible:[&_button]:bg-stone-600/[.85]"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Options cameraRef={cameraRef} />

          <VectorFieldSet
            color={Color.V}
            legend="Boost velocity (v)"
            x={boostVelocity[0]}
            y={0}
            z={0}
            yDisabled
            zDisabled
            xSetter={setBoostVelocityX}
            isBoostVelocity
          />

          <VectorFieldSet
            color={Color.E}
            legend="Original electric field (E)"
            x={eField[0]}
            y={eField[1]}
            z={eField[2]}
            step="0.1"
            xSetter={setEFieldX}
            ySetter={setEFieldY}
            zSetter={setEFieldZ}
          />

          <VectorFieldSet
            color={Color.B}
            legend="Original magnetic field (B)"
            x={bField[0]}
            y={bField[1]}
            z={bField[2]}
            step="0.1"
            xSetter={setBFieldX}
            ySetter={setBFieldY}
            zSetter={setBFieldZ}
          />

          <VectorFieldSet
            color={Color.S}
            legend="Original Poynting vector (S)"
            x={poynting[0]}
            y={poynting[1]}
            z={poynting[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldSet
            color={Color.EPrime}
            legend="Boosted electric field (E′)"
            x={ePrime[0]}
            y={ePrime[1]}
            z={ePrime[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldSet
            color={Color.BPrime}
            legend="Boosted magnetic field (B′)"
            x={bPrime[0]}
            y={bPrime[1]}
            z={bPrime[2]}
            xDisabled
            yDisabled
            zDisabled
          />

          <VectorFieldSet
            color={Color.SPrime}
            legend="Boosted Poynting vector (S′)"
            x={poyntingPrime[0]}
            y={poyntingPrime[1]}
            z={poyntingPrime[2]}
            xDisabled
            yDisabled
            zDisabled
          />
        </form>
      </main>
    </>
  );
};

export default Page;
