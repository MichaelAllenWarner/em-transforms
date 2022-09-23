import * as THREE from 'three';
import { type CartesianComponents } from '../helpers/store';
import { font } from '../helpers/font';
import { Material } from 'three';
import { memo, useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three-stdlib';
import { Color } from '../helpers/Color';

interface Props {
  x: number;
  y: number;
  z: number;
  boostUnitX?: number;
  boostUnitY?: number;
  boostUnitZ?: number;
  color?: Color;
  label?: string;
  opacity?: number;
  showComponentVectors?: boolean;
  hide?: boolean;
}

const origin = new THREE.Vector3(0, 0, 0);

const Vector = memo(
  ({
    x,
    y,
    z,
    boostUnitX,
    boostUnitY,
    boostUnitZ,
    color,
    label,
    opacity,
    showComponentVectors = false,
    hide = false,
  }: Props) => {
    const [ready, setReady] = useState(false);

    // define refs for main vector
    const vector = useRef<THREE.Vector3>();
    const dir = useRef<THREE.Vector3>();
    const arrow = useRef<THREE.ArrowHelper>();
    const labelMesh = useRef<THREE.Mesh>();

    // define refs for component-vector parallel to boost
    const vectorClonePar = useRef<THREE.Vector3>();
    const parCompProjectee = useRef<THREE.Vector3>();
    const parCompVec = useRef<THREE.Vector3>();
    const parCompDir = useRef<THREE.Vector3>();
    const parCompArrow = useRef<THREE.ArrowHelper>();

    // define refs for component-vector perpendicular to boost
    const perpCompVec = useRef<THREE.Vector3>();
    const perpCompDir = useRef<THREE.Vector3>();
    const perpCompArrow = useRef<THREE.ArrowHelper>();

    // define/set all the needed canvas objects here
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

      if (!labelMesh.current) {
        labelMesh.current = (() => {
          const mesh = new THREE.Mesh();
          mesh.geometry = new TextGeometry(label || '', {
            font,
            size: 0.4,
            height: 0,
          });
          mesh.material = new THREE.MeshLambertMaterial({
            color,
            ...(typeof opacity === 'number'
              ? { opacity, transparent: true }
              : {}),
          });
          return mesh;
        })();
      }

      labelMesh.current.position.set(
        ...([x, y, z].map((component) =>
          component < 0 ? component - 0.05 : component + 0.05
        ) as CartesianComponents)
      );
      labelMesh.current.visible = !hide;

      // component-vectors parallel/perpendicular to boost

      if (
        boostUnitX !== undefined &&
        boostUnitY !== undefined &&
        boostUnitZ !== undefined
      ) {
        // first set up parallel component-vector (vector projection), but not arrow yet
        if (vectorClonePar.current) {
          vectorClonePar.current.set(x, y, z);
        } else {
          vectorClonePar.current = vector.current.clone();
        }

        if (parCompProjectee.current) {
          parCompProjectee.current.set(boostUnitX, boostUnitY, boostUnitZ);
        } else {
          parCompProjectee.current = new THREE.Vector3(
            boostUnitX,
            boostUnitY,
            boostUnitZ
          );
        }

        vectorClonePar.current.projectOnVector(parCompProjectee.current);

        // now set up perpendicular component-vector (vector rejection) and its arrow

        if (perpCompVec.current) {
          perpCompVec.current.subVectors(
            vector.current,
            vectorClonePar.current
          );
        } else {
          perpCompVec.current = new THREE.Vector3().subVectors(
            vector.current,
            vectorClonePar.current
          );
        }

        if (perpCompDir.current) {
          perpCompDir.current
            .set(
              perpCompVec.current.x,
              perpCompVec.current.y,
              perpCompVec.current.z
            )
            .normalize();
        } else {
          perpCompDir.current = perpCompVec.current.clone().normalize();
        }

        if (perpCompArrow.current) {
          perpCompArrow.current.setDirection(perpCompDir.current);
          perpCompArrow.current.setLength(
            perpCompVec.current.length(),
            0.2,
            0.1
          );
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

        // now finish up with parallel-component and set up its arrow

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
      }

      setReady(true);
    }, [
      color,
      opacity,
      x,
      y,
      z,
      hide,
      label,
      boostUnitX,
      boostUnitY,
      boostUnitZ,
    ]);

    return ready ? (
      <>
        <mesh
          visible={
            !hide &&
            showComponentVectors &&
            !!perpCompArrow.current &&
            !!parCompArrow.current
          }
        >
          <primitive object={perpCompArrow.current || {}} />
          <primitive object={parCompArrow.current || {}} />
        </mesh>
        <mesh visible={!hide}>
          <primitive object={arrow.current} />
        </mesh>
        <primitive object={labelMesh.current} />
      </>
    ) : (
      <></>
    );
  }
);

Vector.displayName = 'Vector';

export default Vector;
