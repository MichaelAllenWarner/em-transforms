import { font } from '../helpers/font';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Material } from 'three';

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

const opacity = 0.3;

const origin = new THREE.Vector3(0, 0, 0);
const x = new THREE.Vector3(1, 0, 0);
const y = new THREE.Vector3(0, 1, 0);
const z = new THREE.Vector3(0, 0, 1);
const X = new THREE.Vector3(-1, 0, 0);
const Y = new THREE.Vector3(0, -1, 0);
const Z = new THREE.Vector3(0, 0, -1);
const length = 4;
const color = 0x00;
const axes = [x, y, z, X, Y, Z].map((vector) => {
  const axis = new THREE.ArrowHelper(vector, origin, length, color, 0.2, 0.1);
  (axis.line.material as Material).transparent = true;
  (axis.line.material as Material).opacity = opacity;
  (axis.cone.material as Material).transparent = true;
  (axis.cone.material as Material).opacity = opacity;
  return axis;
});

const Axes = () => {
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
                color={'black'}
                transparent
                opacity={opacity}
              />
            </mesh>
          ))}
          {i < 3 && (
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
                color={'black'}
                transparent
                opacity={opacity}
              />
            </mesh>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Axes;
