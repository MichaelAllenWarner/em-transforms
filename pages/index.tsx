/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import useStore, { CartesianComponents } from '../helpers/store';
import shallow from 'zustand/shallow';
import Vector from '../components/Vector';
import { OrbitControls } from 'three-stdlib';
import Axes from '../components/Axes';
import Head from 'next/head';

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

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

const roundN = 12;

const Page = () => {
  const {
    eField,
    bField,
    boostVelocity,
    setEField,
    setBField,
    setBoostVelocity,
  } = useStore(
    (state) => ({
      eField: state.eField,
      bField: state.bField,
      boostVelocity: state.boostVelocity,
      setEField: state.setEField,
      setBField: state.setBField,
      setBoostVelocity: state.setBoostVelocity,
    }),
    shallow
  );

  const boostUnit: CartesianComponents = [Math.sign(boostVelocity), 0, 0];

  const boostRapidity = Math.atanh(boostVelocity);
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

  // for testing that the invariants are equal
  // console.log({
  //   eDotB: dot(eField, bField),
  //   eDotBPrime: dot(ePrime, bPrime),
  //   diffOfSquares: dot(eField, eField) - dot(bField, bField),
  //   diffOfSquaresPrime: dot(ePrime, ePrime) - dot(bPrime, bPrime),
  // });

  return (
    <>
      <Head>
        <title>
          Lorentz Transformation of the Electric and Magnetic Fields, Visualized
        </title>
      </Head>
      <main className="container mt-10 flex h-screen w-screen flex-col space-y-10">
        <div className="space-y-10">
          <h1 className="text-2xl sm:text-3xl">
            Lorentz Transformation of the Electric and Magnetic Fields,
            Visualized
          </h1>
          <details>
            <summary>Instructions</summary>
            <div className="max-w-prose space-y-3 p-4">
              <p>
                This visualization demonstrates how the electric and magnetic
                fields transform under a Lorentz boost.
              </p>
              <p>First, here is how the "camera" works:</p>
              <ul className="ml-4 list-disc">
                <li>
                  To orbit, use the left mouse-button (or one-finger-move for
                  touch).
                </li>
                <li>
                  To zoom, use the mousewheel or the middle mouse-button (or
                  two-finger spread/squish for touch).
                </li>
                <li>
                  To pan, use the right mouse-button (or two-finger move on
                  touch). Panning will change the focal point for orbiting and
                  zooming.
                </li>
              </ul>
              <p>
                Use the inputs below the visualization to set the Cartesian
                components of the electric- and magnetic-field vectors in the
                original "unprimed" frame, as well as the (x-component of the)
                boost-velocity. The electric- and magnetic-field vectors in the
                "primed" frame are calculated and rendered automatically.
              </p>
              <p>
                The inputs can only accept number-values, even while you're
                typing the number. Since a minus-sign by itself isn't
                interpreted as a number, entering a negative number is a bit
                cumbersome: you have to type at least one digit <em>before</em>{' '}
                inserting the minus sign at the start. Sorry about that.
              </p>
              <p>
                Electric and magnetic fields are measured in the same unit. The
                boost-speed is normalized (i.e., it's given as a fraction of the
                speed of light and can be no greater than 1). Finally, the
                Cartesian axes and their labels are fixed; perhaps in the future
                I'll make them adjustable or have them adapt to the vectors in
                the space.
              </p>
            </div>
          </details>
        </div>
        <Canvas className="max-h-screen min-h-[600px] flex-1 px-12 [&>*]:border">
          <CameraController />
          <ambientLight />
          <Axes />
          <Vector components={eField} color="blue" label="E" />
          <Vector components={bField} color="crimson" label="B" />
          <Vector components={[boostVelocity, 0, 0]} color="green" label="v" />
          <Vector components={ePrime} color="saddlebrown" label="E'" />
          <Vector components={bPrime} color="purple" label="B'" />
        </Canvas>
        <form
          className="flex flex-wrap gap-8 pb-10 [&_input]:ml-3 [&_input]:border [&_legend]:text-xl [&_fieldset]:flex [&_fieldset]:flex-col [&_fieldset]:space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <fieldset className="text-[green]">
            <legend>Boost velocity (v)</legend>
            <label>
              x-component
              <input
                value={parseFloat(boostVelocity.toFixed(roundN))}
                type="number"
                min="-.9999"
                max=".9999"
                step="0.05"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (n >= 1) n = 0.9999;
                  if (n <= -1) n = -0.9999;
                  if (isNaN(n)) n = 0;
                  setBoostVelocity(n);
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
          <fieldset className="text-[blue]">
            <legend>Original electric field (E)</legend>
            <label>
              x-component
              <input
                value={parseFloat(eField[0].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setEField([n, eField[1], eField[2]]);
                }}
              />
            </label>
            <label>
              y-component
              <input
                value={parseFloat(eField[1].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setEField([eField[0], n, eField[2]]);
                }}
              />
            </label>
            <label>
              z-component
              <input
                value={parseFloat(eField[2].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setEField([eField[0], eField[1], n]);
                }}
              />
            </label>
          </fieldset>
          <fieldset className="text-[crimson]">
            <legend>Original magnetic field (B)</legend>
            <label>
              x-component
              <input
                value={parseFloat(bField[0].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setBField([n, bField[1], bField[2]]);
                }}
              />
            </label>
            <label>
              y-component
              <input
                value={parseFloat(bField[1].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setBField([bField[0], n, bField[2]]);
                }}
              />
            </label>
            <label>
              z-component
              <input
                value={parseFloat(bField[2].toFixed(roundN))}
                type="number"
                onChange={(e) => {
                  let n = e.target.valueAsNumber;
                  if (isNaN(n)) n = 0;
                  setBField([bField[0], bField[1], n]);
                }}
              />
            </label>
          </fieldset>
          <fieldset className="text-[saddlebrown]">
            <legend>Boosted electric field (E`)</legend>
            <label>
              x-component
              <input
                value={parseFloat(ePrime[0].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
            <label>
              y-component
              <input
                value={parseFloat(ePrime[1].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
            <label>
              z-component
              <input
                value={parseFloat(ePrime[2].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
          </fieldset>
          <fieldset className="text-[purple]">
            <legend>Boosted magnetic field (B`)</legend>
            <label>
              x-component
              <input
                value={parseFloat(bPrime[0].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
            <label>
              y-component
              <input
                value={parseFloat(bPrime[1].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
            <label>
              z-component
              <input
                value={parseFloat(bPrime[2].toFixed(roundN))}
                type="number"
                disabled
              />
            </label>
          </fieldset>
        </form>
      </main>
    </>
  );
};

export default Page;
