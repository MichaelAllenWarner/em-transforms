import * as THREE from 'three';
import { type Material } from 'three';

/**
 * `THREE.ArrowHelper`, but `line.material` and `cone.material` are `Material`
 * instead of `Material | Material[]`.
 */
export type ArrowHelperWithNonArrayMaterials = Omit<
  THREE.ArrowHelper,
  'line' | 'cone'
> & {
  line: Omit<THREE.ArrowHelper['line'], 'material'> & { material: Material };
  cone: Omit<THREE.ArrowHelper['cone'], 'material'> & { material: Material };
};

/**
 * Narrows the `Material | Material[]` of `line.material` and `cone.material`
 * down to `Material` (so that we can avoid type-casting).
 */
export const isArrowHelperWithNonArrayMaterials = (
  arrowHelper: THREE.ArrowHelper,
): arrowHelper is ArrowHelperWithNonArrayMaterials => {
  return !Array.isArray(arrowHelper.line.material);
};
