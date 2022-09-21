import * as THREE from 'three';
import { type CartesianComponents } from '../helpers/store';
import { font } from '../helpers/font';
import { Material } from 'three';
import { memo, useEffect, useRef, useState } from 'react';

interface Props {
  x: number;
  y: number;
  z: number;
  color?: string;
  label?: string;
  opacity?: number;
  showComponentVectors?: boolean;
  hide?: boolean;
}

const origin = new THREE.Vector3(0, 0, 0);

const Vector = memo(
  ({ x, y, z, color, label, opacity, showComponentVectors, hide }: Props) => {
    const [vectorsAreReady, setVectorsAreReady] = useState(false);

    // define refs for main vector
    const vector = useRef<THREE.Vector3>();
    const dir = useRef<THREE.Vector3>();
    const arrow = useRef<THREE.ArrowHelper>();

    // define refs for component-vector perpendicular to boost (x-axis)
    const vectorClonePerp = useRef<THREE.Vector3>();
    const perpCompProjectee = useRef<THREE.Vector3>();
    const perpCompVec = useRef<THREE.Vector3>();
    const perpCompDir = useRef<THREE.Vector3>();
    const perpCompArrow = useRef<THREE.ArrowHelper>();

    // define component-vector parallel to boost (x-axis) with refs
    const vectorClonePar = useRef<THREE.Vector3>();
    const parCompProjectee = useRef<THREE.Vector3>();
    const parCompVec = useRef<THREE.Vector3>();
    const parCompDir = useRef<THREE.Vector3>();
    const parCompArrow = useRef<THREE.ArrowHelper>();

    // (is this the right hook to use? I'm wondering about fast changes)
    useEffect(() => {
      // main vector

      if (vector.current) {
        vector.current.set(x, y, z);
      } else {
        vector.current = new THREE.Vector3(x, y, z);
      }

      if (dir.current) {
        dir.current.set(x, y, z).normalize();
      } else {
        dir.current = vector.current.clone().normalize();
      }

      if (arrow.current) {
        arrow.current.setDirection(dir.current);
        arrow.current.setLength(vector.current.length(), 0.2, 0.1);
      } else {
        arrow.current = (() => {
          const arrowHelper = new THREE.ArrowHelper(
            dir.current,
            origin,
            vector.current.length(),
            color,
            0.2,
            0.1
          );
          if (opacity) {
            (arrowHelper.line.material as Material).transparent = true;
            (arrowHelper.line.material as Material).opacity = opacity;
            (arrowHelper.cone.material as Material).transparent = true;
            (arrowHelper.cone.material as Material).opacity = opacity;
          }
          return arrowHelper;
        })();
      }

      // component-vector perpendicular to boost (x-axis)

      if (vectorClonePerp.current) {
        vectorClonePerp.current.set(x, y, z);
      } else {
        vectorClonePerp.current = vector.current.clone();
      }

      if (perpCompProjectee.current) {
        perpCompProjectee.current.set(0, y, z);
      } else {
        perpCompProjectee.current = new THREE.Vector3(0, y, z);
      }

      vectorClonePerp.current.projectOnVector(perpCompProjectee.current);

      if (perpCompVec.current) {
        perpCompVec.current.set(
          vectorClonePerp.current.x,
          vectorClonePerp.current.y,
          vectorClonePerp.current.z
        );
      } else {
        perpCompVec.current = vectorClonePerp.current.projectOnVector(
          perpCompProjectee.current
        );
      }

      if (perpCompDir.current) {
        perpCompDir.current
          .set(
            vectorClonePerp.current.x,
            vectorClonePerp.current.y,
            vectorClonePerp.current.z
          )
          .normalize();
      } else {
        perpCompDir.current = perpCompVec.current.clone().normalize();
      }

      if (perpCompArrow.current) {
        perpCompArrow.current.setDirection(perpCompDir.current);
        perpCompArrow.current.setLength(perpCompVec.current.length(), 0.2, 0.1);
      } else {
        perpCompArrow.current = (() => {
          const arrowHelper = new THREE.ArrowHelper(
            perpCompDir.current,
            origin,
            perpCompVec.current.length(),
            color,
            0.2,
            0.1
          );
          (arrowHelper.line.material as Material).transparent = true;
          (arrowHelper.line.material as Material).opacity = 0.2;
          (arrowHelper.cone.material as Material).transparent = true;
          (arrowHelper.cone.material as Material).opacity = 0.2;
          return arrowHelper;
        })();
      }

      // component-vector parallel to boost (x-axis)

      if (vectorClonePar.current) {
        vectorClonePar.current.set(x, y, z);
      } else {
        vectorClonePar.current = vector.current.clone();
      }

      if (parCompProjectee.current) {
        parCompProjectee.current.set(x, 0, 0);
      } else {
        parCompProjectee.current = new THREE.Vector3(x, 0, 0);
      }

      vectorClonePar.current.projectOnVector(parCompProjectee.current);

      if (parCompVec.current) {
        parCompVec.current.set(
          vectorClonePar.current.x,
          vectorClonePar.current.y,
          vectorClonePar.current.z
        );
      } else {
        parCompVec.current = vectorClonePar.current.projectOnVector(
          parCompProjectee.current
        );
      }

      if (parCompDir.current) {
        parCompDir.current
          .set(
            vectorClonePar.current.x,
            vectorClonePar.current.y,
            vectorClonePar.current.z
          )
          .normalize();
      } else {
        parCompDir.current = parCompVec.current.clone().normalize();
      }

      if (parCompArrow.current) {
        parCompArrow.current.setDirection(parCompDir.current);
        parCompArrow.current.setLength(parCompVec.current.length(), 0.2, 0.1);
        parCompArrow.current.position.set(
          perpCompVec.current.x,
          perpCompVec.current.y,
          perpCompVec.current.z
        );
      } else {
        parCompArrow.current = (() => {
          const arrowHelper = new THREE.ArrowHelper(
            parCompDir.current,
            perpCompVec.current,
            parCompVec.current.length(),
            color,
            0.2,
            0.1
          );
          (arrowHelper.line.material as Material).transparent = true;
          (arrowHelper.line.material as Material).opacity = 0.2;
          (arrowHelper.cone.material as Material).transparent = true;
          (arrowHelper.cone.material as Material).opacity = 0.2;
          return arrowHelper;
        })();
      }

      setVectorsAreReady(true);
    }, [color, opacity, x, y, z]);

    return vectorsAreReady ? (
      <>
        <mesh visible={!hide && showComponentVectors}>
          <primitive object={perpCompArrow.current} />
          <primitive object={parCompArrow.current} />
        </mesh>
        <mesh visible={!hide}>
          <primitive object={arrow.current} />
        </mesh>
        {/* label stuff is getting recreated every render at the moment; would be better not to */}
        {label && (
          <mesh
            position={
              [x, y, z].map((component) =>
                component < 0 ? component - 0.05 : component + 0.05
              ) as CartesianComponents
            }
            visible={!hide}
          >
            <textGeometry
              args={[
                label,
                {
                  // @ts-ignore
                  font,
                  size: 0.4,
                  height: 0,
                },
              ]}
            />
            <meshLambertMaterial
              color={color}
              {...(opacity ? { transparent: true, opacity } : {})}
            />
          </mesh>
        )}
      </>
    ) : (
      <></>
    );
  }
);

Vector.displayName = 'Vector';

export default Vector;
