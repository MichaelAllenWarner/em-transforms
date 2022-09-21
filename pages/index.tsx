/* eslint-disable react/no-unescaped-entities */
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import useStore, { CartesianComponents } from '../helpers/store';
import shallow from 'zustand/shallow';
import Vector from '../components/Vector';
import { OrbitControls } from 'three-stdlib';
import Axes from '../components/Axes';
import Head from 'next/head';
import * as THREE from 'three';

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

const round = (n: number) => parseFloat(n.toFixed(12));

const boostVelocity = new THREE.Vector3();
const boostUnitVelocity = boostVelocity.clone();

enum Color {
  E = 'blue',
  B = 'crimson',
  V = 'saddlebrown',
  EPrime = 'purple',
  BPrime = 'mediumvioletred',
  S = 'green',
  SPrime = 'darkslategray',
}

const textColor: { [C in Color]: `text-[${C}]` } = /* tw */ {
  blue: 'text-[blue]',
  crimson: 'text-[crimson]',
  saddlebrown: 'text-[saddlebrown]',
  purple: 'text-[purple]',
  mediumvioletred: 'text-[mediumvioletred]',
  green: 'text-[green]',
  darkslategray: 'text-[darkslategray]',
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
    boostVelocityX,
    setEField,
    setBField,
    setBoostVelocityX,
  } = useStore(
    (state) => ({
      eField: state.eField,
      bField: state.bField,
      boostVelocityX: state.boostVelocityX,
      setEField: state.setEField,
      setBField: state.setBField,
      setBoostVelocityX: state.setBoostVelocityX,
    }),
    shallow
  );

  const [showComponentVectors, setShowComponentVectors] = useState(false);
  const [showPoynting, setShowPoynting] = useState(false);

  boostVelocity.set(boostVelocityX, 0, 0);
  boostUnitVelocity.set(boostVelocityX, 0, 0).normalize();

  const boostUnit = [
    boostUnitVelocity.x,
    boostUnitVelocity.y,
    boostUnitVelocity.z,
  ] as CartesianComponents;

  const boostRapidity = Math.atanh(boostVelocity.length());
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
          <Vector x={boostVelocityX} y={0} z={0} color={Color.V} label="v" />
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
          <fieldset className="w-full">
            <legend>Options</legend>
            <label>
              <input
                type="checkbox"
                checked={showComponentVectors}
                onChange={(e) => setShowComponentVectors(e.target.checked)}
              />
              Show component-vectors parallel and perpendicular to
              boost-velocity.
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

          <fieldset className={`${textColor[Color.V]}`}>
            <legend>Boost velocity (v)</legend>
            <label>
              x-component
              <input
                value={round(boostVelocityX)}
                type="number"
                min="-.9999"
                max=".9999"
                step="0.05"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (n >= 1) n = 0.9999;
                  if (n <= -1) n = -0.9999;
                  if (isNaN(n)) n = 0;
                  setBoostVelocityX(n);
                }}
              />
            </label>
            <label>
              y-component
              <input
                value="0"
                type="number"
                disabled
                min="-.9999"
                max=".9999"
              />
            </label>
            <label>
              z-component
              <input
                value="0"
                type="number"
                disabled
                min="-.9999"
                max=".9999"
              />
            </label>
          </fieldset>

          {/* original electric and magnetic fields */}
          {[
            {
              color: Color.E,
              legend: 'Original electric field (E)',
              cartesians: eField,
              setter: setEField,
            },
            {
              color: Color.B,
              legend: 'Original magnetic field (B)',
              cartesians: bField,
              setter: setBField,
            },
          ].map(({ color, legend, cartesians, setter }, i) => (
            <fieldset key={i} className={textColor[color]}>
              <legend>{legend}</legend>
              {['x', 'y', 'z'].map((e, j) => (
                <label key={j}>
                  {e}-component
                  <input
                    value={round(cartesians[j])}
                    type="number"
                    step="0.1"
                    onChange={(e) => {
                      let n = e.target.valueAsNumber;
                      if (isNaN(n)) n = 0;
                      setter([
                        j === 0 ? n : cartesians[0],
                        j === 1 ? n : cartesians[1],
                        j === 2 ? n : cartesians[2],
                      ]);
                    }}
                  />
                </label>
              ))}
            </fieldset>
          ))}

          {/* disabled fieldsets (inputs are display-only) */}
          {[
            {
              color: Color.S,
              legend: 'Original Poynting vector (S)',
              cartesians: poynting,
            },
            {
              color: Color.EPrime,
              legend: 'Boosted electric field (E′)',
              cartesians: ePrime,
            },
            {
              color: Color.BPrime,
              legend: 'Boosted magnetic field (B′)',
              cartesians: bPrime,
            },
            {
              color: Color.SPrime,
              legend: 'Boosted Poynting vector (S′)',
              cartesians: poyntingPrime,
            },
          ].map(({ color, legend, cartesians }, i) => (
            <fieldset key={i} className={textColor[color]}>
              <legend>{legend}</legend>
              {['x', 'y', 'z'].map((e, j) => (
                <label key={j}>
                  {e}-component
                  <input value={round(cartesians[j])} type="number" disabled />
                </label>
              ))}
            </fieldset>
          ))}
        </form>
      </main>
    </>
  );
};

export default Page;
