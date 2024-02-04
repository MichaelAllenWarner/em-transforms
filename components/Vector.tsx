import * as THREE from 'three';
import { type CartesianComponents } from '../store/store';
import { font } from '../helpers/font';
import { Material } from 'three';
import { memo, useEffect, useRef, useState } from 'react';
import { TextGeometry } from 'three-stdlib';
import { Color, ColorDark } from '../helpers/Color';
import { useTheme } from 'next-themes';
import {
  ArrowHelperWithNonArrayMaterials,
  isArrowHelperWithNonArrayMaterials,
} from '../helpers/ArrowHelperWithNonArrayMaterials';

interface Props {
  x: number;
  y: number;
  z: number;
  boostUnitX?: number;
  boostUnitY?: number;
  boostUnitZ?: number;
  color: Color;
  colorDark: ColorDark;
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
    color: colorLight,
    colorDark,
    label,
    opacity,
    showComponentVectors = false,
    hide = false,
  }: Props) => {
    const [ready, setReady] = useState(false);

    const { resolvedTheme } = useTheme();
    const color = resolvedTheme === 'dark' ? colorDark : colorLight;

    /*
      Use refs for the needed THREE.js objects, and mutate them in the `useEffect()`.
      This prevents them from getting destroyed and recreated on re-renders, which
      helps with performance.

      For further optimization, could use zustand's transient update mechanism to handle
      changes to x/y/z state (instead of passing those values in as props). This would prevent
      the component from having to re-render at all in that scenario. See:

      https://github.com/pmndrs/zustand#transient-updates-for-often-occurring-state-changes

      However, that would require quite a bit of refactoring, since right now most of the vectors
      are calculated on the fly in response to state-changes. Performance seems all right
      at the moment, so leaving it be.
    */

    // define refs for main vector
    const vector = useRef<THREE.Vector3>();
    const dir = useRef<THREE.Vector3>();
    const arrow = useRef<ArrowHelperWithNonArrayMaterials>();
    const labelMesh =
      useRef<THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial>>();

    // define refs for component-vector parallel to boost
    const vectorClonePar = useRef<THREE.Vector3>();
    const parCompProjectee = useRef<THREE.Vector3>();
    const parCompVec = useRef<THREE.Vector3>();
    const parCompDir = useRef<THREE.Vector3>();
    const parCompArrow = useRef<ArrowHelperWithNonArrayMaterials>();

    // define refs for component-vector perpendicular to boost
    const perpCompVec = useRef<THREE.Vector3>();
    const perpCompDir = useRef<THREE.Vector3>();
    const perpCompArrow = useRef<ArrowHelperWithNonArrayMaterials>();

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
        if (color) arrow.current.setColor(color);
      } else {
        arrow.current = (() => {
          const arrowHelper = new THREE.ArrowHelper(
            dir.current,
            origin,
            vector.current.length(),
            color,
            0.2,
            0.1,
          );
          if (!isArrowHelperWithNonArrayMaterials(arrowHelper)) {
            throw new Error(
              'Expected `arrowHelper.line.material` and `arrowHelper.cone.material` not to be arrays (for `arrow.current`).',
            );
          }
          if (typeof opacity === 'number') {
            arrowHelper.line.material.transparent = true;
            arrowHelper.line.material.opacity = opacity;
            arrowHelper.cone.material.transparent = true;
            arrowHelper.cone.material.opacity = opacity;
          }
          return arrowHelper;
        })();
      }

      if (labelMesh.current) {
        if (color) labelMesh.current.material.color.setStyle(color);
      } else {
        labelMesh.current = (() => {
          const mesh = new THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial>();
          mesh.geometry = new TextGeometry(label || '', {
            font,
            size: 0.4,
            height: 0,
          });
          mesh.material = new THREE.MeshBasicMaterial({
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
          component < 0 ? component - 0.05 : component + 0.05,
        ) as CartesianComponents),
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
            boostUnitZ,
          );
        }

        vectorClonePar.current.projectOnVector(parCompProjectee.current);

        // now set up perpendicular component-vector (vector rejection) and its arrow

        if (perpCompVec.current) {
          perpCompVec.current.subVectors(
            vector.current,
            vectorClonePar.current,
          );
        } else {
          perpCompVec.current = new THREE.Vector3().subVectors(
            vector.current,
            vectorClonePar.current,
          );
        }

        if (perpCompDir.current) {
          perpCompDir.current
            .set(
              perpCompVec.current.x,
              perpCompVec.current.y,
              perpCompVec.current.z,
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
            0.1,
          );
          if (color) perpCompArrow.current.setColor(color);
        } else {
          perpCompArrow.current = (() => {
            const arrowHelper = new THREE.ArrowHelper(
              perpCompDir.current,
              origin,
              perpCompVec.current.length(),
              color,
              0.2,
              0.1,
            );
            if (!isArrowHelperWithNonArrayMaterials(arrowHelper)) {
              throw new Error(
                'Expected `arrowHelper.line.material` and `arrowHelper.cone.material` not to be arrays (for `perpCompArrow.current`).',
              );
            }
            arrowHelper.line.material.transparent = true;
            arrowHelper.line.material.opacity = 0.2;
            arrowHelper.cone.material.transparent = true;
            arrowHelper.cone.material.opacity = 0.2;
            return arrowHelper;
          })();
        }

        // now finish up with parallel-component and set up its arrow

        if (parCompVec.current) {
          parCompVec.current.set(
            vectorClonePar.current.x,
            vectorClonePar.current.y,
            vectorClonePar.current.z,
          );
        } else {
          parCompVec.current = vectorClonePar.current.projectOnVector(
            parCompProjectee.current,
          );
        }

        if (parCompDir.current) {
          parCompDir.current
            .set(
              vectorClonePar.current.x,
              vectorClonePar.current.y,
              vectorClonePar.current.z,
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
            perpCompVec.current.z,
          );
          if (color) parCompArrow.current.setColor(color);
        } else {
          parCompArrow.current = (() => {
            const arrowHelper = new THREE.ArrowHelper(
              parCompDir.current,
              perpCompVec.current,
              parCompVec.current.length(),
              color,
              0.2,
              0.1,
            );
            if (!isArrowHelperWithNonArrayMaterials(arrowHelper)) {
              throw new Error(
                'Expected `arrowHelper.line.material` and `arrowHelper.cone.material` not to be arrays (for `parCompArrow.current`).',
              );
            }
            arrowHelper.line.material.transparent = true;
            arrowHelper.line.material.opacity = 0.2;
            arrowHelper.cone.material.transparent = true;
            arrowHelper.cone.material.opacity = 0.2;
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
          <primitive object={arrow.current || {}} />
        </mesh>
        <primitive object={labelMesh.current || {}} />
      </>
    ) : (
      <></>
    );
  },
);

Vector.displayName = 'Vector';

export default Vector;
