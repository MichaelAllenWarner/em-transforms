import { font } from '../helpers/font';
import { extend, useFrame, type ReactThreeFiber } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
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
  const labelsGroupRef = useRef<THREE.Group>(null);
  const axisLabelGroupRefs = useRef<(THREE.Group | null)[]>([null, null, null]);

  useEffect(() => {
    axes.forEach((axis) => {
      axis.setColor(color);
      axis.cone.material.opacity = opacity;
      axis.line.material.opacity = opacity;
    });
  }, [color, opacity]);

  useFrame(({ camera }) => {
    // Billboard each axis label group so letter+prime+bracket rotate together
    axisLabelGroupRefs.current.forEach((group) => {
      if (group) group.quaternion.copy(camera.quaternion);
    });
    // Billboard tick number labels individually (not children of axis label groups)
    if (labelsGroupRef.current) {
      labelsGroupRef.current.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.geometry instanceof TextGeometry &&
          !axisLabelGroupRefs.current.includes(
            child.parent as THREE.Group | null,
          )
        ) {
          child.quaternion.copy(camera.quaternion);
        }
      });
    }
  });

  return (
    <group ref={labelsGroupRef}>
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
            <group
              ref={(el) => {
                axisLabelGroupRefs.current[i] = el;
              }}
              position={[
                i === 0 ? length + 0.1 : 0,
                i === 1 ? length + 0.1 : 0,
                i === 2 ? length + 0.1 : 0,
              ]}
            >
              <mesh position={[0, 0, 0]}>
                <textGeometry
                  args={[
                    ['x', 'y', 'z'][i],
                    {
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
              <mesh position={[0.25, 0, 0]}>
                <textGeometry
                  args={[
                    '′',
                    {
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
              <mesh position={[0.2, 0.2, 0]}>
                <textGeometry
                  args={[
                    '[ ]',
                    {
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
            </group>
          )}
        </React.Fragment>
      ))}
    </group>
  );
};

export default Axes;
