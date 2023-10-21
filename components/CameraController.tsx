import { useThree } from '@react-three/fiber';
import { forwardRef, useEffect } from 'react';
import { OrbitControls } from 'three-stdlib';
import { QueryParameterKey } from '../helpers/QueryParamKey';
import debounce from 'lodash/debounce';
import { type EventDispatcher } from 'three';

/**
 * Sets up the camera/controller, stores the controller-object
 * in the ref, and sets up camera-related query-parameters
 * to set camera "state" on mount and to update on "state"-change.
 */
const CameraController = forwardRef<OrbitControls>((_, ref) => {
  const { camera, gl } = useThree();

  // will only fire once, b/c dependency-array entries are all stable references
  useEffect(() => {
    // first, create the `OrbitControls` instance...
    const controls: EventDispatcher<OrbitControls> & OrbitControls =
      new OrbitControls(camera, gl.domElement);

    // ...and set `ref` to it, but w/ a Proxy that dispatches the `'end'` event on `.reset()` (see below).
    if (ref && typeof ref !== 'function') {
      ref.current = new Proxy(controls, {
        get: (target, prop, receiver) => {
          if (prop === 'reset') {
            return () => {
              controls.reset();
              controls.dispatchEvent({
                type: 'end',
              });
            };
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    }

    // set query-parameters to update on `'end'` event (after user changes or resets camera "state")
    controls.addEventListener(
      'end',
      debounce(() => {
        const params = new URLSearchParams(window.location.search);
        params.set(
          QueryParameterKey.azimuthal,
          controls.getAzimuthalAngle().toString(),
        );
        params.set(
          QueryParameterKey.polar,
          controls.getPolarAngle().toString(),
        );
        params.set(QueryParameterKey.x, controls.object.position.x.toString());
        params.set(QueryParameterKey.y, controls.object.position.y.toString());
        params.set(QueryParameterKey.z, controls.object.position.z.toString());
        params.set(QueryParameterKey.targetX, controls.target.x.toString());
        params.set(QueryParameterKey.targetY, controls.target.y.toString());
        params.set(QueryParameterKey.targetZ, controls.target.z.toString());
        window.history.replaceState({}, '', `?${params.toString()}`);
      }, 250),
    );

    // finally, set initial camera "state" from query-parameters

    const queryParams = new URLSearchParams(window.location.search);

    if (
      queryParams.has(QueryParameterKey.x) &&
      queryParams.has(QueryParameterKey.y) &&
      queryParams.has(QueryParameterKey.z)
    ) {
      const x = queryParams.get(QueryParameterKey.x);
      const y = queryParams.get(QueryParameterKey.y);
      const z = queryParams.get(QueryParameterKey.z);
      const nx = Number(x);
      const ny = Number(y);
      const nz = Number(z);
      if (Number.isFinite(nx) && Number.isFinite(ny) && Number.isFinite(nz)) {
        controls.object.position.set(nx, ny, nz);
        controls.update();
      } else {
        console.error(
          `The values \`${x}\`, \`${y}\`, and \`${z}\` of query parameters \`${QueryParameterKey.x}\`, \`${QueryParameterKey.y}\`, and \`${QueryParameterKey.z}\`,  were coerced to numbers \`${nx}\`, \`${ny}\`, and \`${nz}\`, at least one of which is not finite. Skipping.`,
        );
      }
    }

    if (
      queryParams.has(QueryParameterKey.targetX) &&
      queryParams.has(QueryParameterKey.targetY) &&
      queryParams.has(QueryParameterKey.targetZ)
    ) {
      const targetX = queryParams.get(QueryParameterKey.targetX);
      const targetY = queryParams.get(QueryParameterKey.targetY);
      const targetZ = queryParams.get(QueryParameterKey.targetZ);
      const nTargetX = Number(targetX);
      const nTargetY = Number(targetY);
      const nTargetZ = Number(targetZ);
      if (
        Number.isFinite(nTargetX) &&
        Number.isFinite(nTargetY) &&
        Number.isFinite(nTargetZ)
      ) {
        controls.target.set(nTargetX, nTargetY, nTargetZ);
        controls.update();
      } else {
        console.error(
          `The values \`${targetX}\`, \`${targetY}\`, and \`${targetZ}\` of query parameters \`${QueryParameterKey.targetX}\`, \`${QueryParameterKey.targetY}\`, and \`${QueryParameterKey.targetZ}\`,  were coerced to numbers \`${nTargetX}\`, \`${nTargetY}\`, and \`${nTargetZ}\`, at least one of which is not finite. Skipping.`,
        );
      }
    }

    if (queryParams.has(QueryParameterKey.azimuthal)) {
      const azimuthal = queryParams.get(QueryParameterKey.azimuthal);
      const n = Number(azimuthal);
      if (Number.isFinite(n)) {
        controls.setAzimuthalAngle(n);
      } else {
        console.error(
          `The value \`${azimuthal}\` of query parameter \`${QueryParameterKey.azimuthal}\` was coerced to \`${n}\`, which is not finite. Skipping.`,
        );
      }
    }

    if (queryParams.has(QueryParameterKey.polar)) {
      const polar = queryParams.get(QueryParameterKey.polar);
      const n = Number(polar);
      if (Number.isFinite(n)) {
        controls.setPolarAngle(n);
      } else {
        console.error(
          `The value \`${polar}\` of query parameter \`${QueryParameterKey.polar}\` was coerced to \`${n}\`, which is not finite. Skipping.`,
        );
      }
    }

    return () => {
      controls.dispose();
    };
  }, [camera, gl, ref]);

  return null;
});
CameraController.displayName = 'CameraController';

export default CameraController;
