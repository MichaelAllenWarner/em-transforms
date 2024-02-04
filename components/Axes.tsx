import { font } from '../helpers/font';
import { extend, type ReactThreeFiber } from '@react-three/fiber';
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three-stdlib';
import { useTheme } from 'next-themes';
import {
  ArrowHelperWithNonArrayMaterials,
  isArrowHelperWithNonArrayMaterials,
} from '../helpers/ArrowHelperWithNonArrayMaterials';

// see https://github.com/pmndrs/react-three-fiber/discussions/1742#discussioncomment-2567726
extend({ TextGeometry });
declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: ReactThreeFiber.Object3DNode<
        TextGeometry,
        typeof TextGeometry
      >;
    }
  }
}

const lightModeOpacity = 0.3;
const darkModeOpacity = 0.4;
const lightModeColor = 0x00;
const darkModeColor = 0xffffff;

const origin = new THREE.Vector3(0, 0, 0);
const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);
const z = new THREE.Vector3(0, 0, 1);
const X = new THREE.Vector3(-1, 0, 0);
const Y = new THREE.Vector3(0, -1, 0);
const Z = new THREE.Vector3(0, 0, -1);
const length = 4;

const axes = [x, y, z, X, Y, Z].map(
  (vector): ArrowHelperWithNonArrayMaterials => {
    const axis = new THREE.ArrowHelper(
      vector,
      origin,
      length,
      lightModeColor,
      0.2,
      0.1,
    );
    if (!isArrowHelperWithNonArrayMaterials(axis)) {
      throw new Error(
        'Expected `axis.line.material` and `axis.cone.material` not to be arrays.',
      );
    }
    axis.line.material.transparent = true;
    axis.line.material.opacity = lightModeOpacity;
    axis.cone.material.transparent = true;
    axis.cone.material.opacity = lightModeOpacity;
    return axis;
  },
);

const Axes = () => {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === 'dark' ? darkModeColor : lightModeColor;
  const opacity = resolvedTheme === 'dark' ? darkModeOpacity : lightModeOpacity;

  useEffect(() => {
    axes.forEach((axis) => {
      axis.setColor(color);
      axis.cone.material.opacity = opacity;
    });
  }, [color, opacity]);

  return (
    <>
      {axes.map((axis, i) => (
        <React.Fragment key={i}>
          <primitive object={axis} />
          {Array.from({ length: length - 1 }, (_, j) => (
            <mesh
              key={j}
              position={[
                i === 0 ? j + 1 : i === 3 ? -(j + 1) : 0,
                i === 1 ? j + 1 : i === 4 ? -(j + 1) : 0,
                i === 2 ? j + 1 : i === 5 ? -(j + 1) : 0,
              ]}
            >
              <textGeometry
                args={[
                  `${i < 3 ? j + 1 : -(j + 1)}`,
                  {
                    // @ts-ignore
                    font,
                    size: 0.1,
                    height: 0,
                  },
                ]}
              />
              <meshLambertMaterial
                color={color}
                transparent
                opacity={opacity}
              />
            </mesh>
          ))}
          {i < 3 && (
            <>
              <mesh
                position={[
                  i === 0 ? length + 0.1 : 0,
                  i === 1 ? length + 0.1 : 0,
                  i === 2 ? length + 0.1 : 0,
                ]}
              >
                <textGeometry
                  args={[
                    ['x', 'y', 'z'][i],
                    {
                      // @ts-ignore
                      font,
                      size: 0.3,
                      height: 0,
                    },
                  ]}
                />
                <meshLambertMaterial
                  color={color}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              <mesh
                position={[
                  i === 0 ? length + 0.35 : 0.28,
                  i === 1 ? length + 0.1 : 0,
                  i === 2 ? length + 0.1 : 0,
                ]}
              >
                <textGeometry
                  args={[
                    '′',
                    {
                      // @ts-ignore
                      font,
                      size: 0.3,
                      height: 0,
                    },
                  ]}
                />
                <meshLambertMaterial
                  color={color}
                  transparent
                  opacity={opacity}
                />
              </mesh>
              <mesh
                position={[
                  i === 0 ? length + 0.3 : 0.23,
                  i === 1 ? length + 0.3 : 0.2,
                  i === 2 ? length + 0.1 : 0,
                ]}
              >
                <textGeometry
                  args={[
                    '[ ]',
                    {
                      // @ts-ignore
                      font,
                      size: 0.15,
                      height: 0,
                    },
                  ]}
                />
                <meshLambertMaterial
                  color={color}
                  transparent
                  opacity={opacity}
                />
              </mesh>
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Axes;
