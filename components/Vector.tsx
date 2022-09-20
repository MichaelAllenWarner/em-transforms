import * as THREE from 'three';
import { type CartesianComponents } from '../helpers/store';
import { font } from '../helpers/font';
import { Material } from 'three';

interface Props {
  components: CartesianComponents;
  color?: string;
  label?: string;
  opacity?: number;
  showComponentVectors?: boolean;
}

const origin = new THREE.Vector3(0, 0, 0);

const Vector = ({
  components,
  color,
  label,
  opacity,
  showComponentVectors,
}: Props) => {
  const vector = new THREE.Vector3(...components);
  const dir = vector.clone().normalize();
  const length = vector.length();

  const arrow = new THREE.ArrowHelper(dir, origin, length, color, 0.2, 0.1);

  if (opacity) {
    (arrow.line.material as Material).transparent = true;
    (arrow.line.material as Material).opacity = opacity;
    (arrow.cone.material as Material).transparent = true;
    (arrow.cone.material as Material).opacity = opacity;
  }

  const perpCompVec =
    showComponentVectors && new THREE.Vector3(0, components[1], components[2]);
  const parCompVec =
    showComponentVectors && new THREE.Vector3(components[0], 0, 0);

  return (
    <>
      {perpCompVec &&
        parCompVec &&
        [perpCompVec, parCompVec].map((v, i) => {
          const compVector = vector.clone().projectOnVector(v);
          const compVectorDir = compVector.clone().normalize();
          const compVectorLength = compVector.length();
          const compVectorOrigin = v === perpCompVec ? origin : perpCompVec;

          const compArrow = new THREE.ArrowHelper(
            compVectorDir,
            compVectorOrigin,
            compVectorLength,
            color,
            0.2,
            0.1
          );
          (compArrow.line.material as Material).transparent = true;
          (compArrow.line.material as Material).opacity = 0.2;
          (compArrow.cone.material as Material).transparent = true;
          (compArrow.cone.material as Material).opacity = 0.2;
          return <primitive key={i} object={compArrow} />;
        })}
      <primitive object={arrow} />
      {label && (
        <mesh
          position={
            components.map((component) =>
              component < 0 ? component - 0.05 : component + 0.05
            ) as CartesianComponents
          }
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
  );
};

export default Vector;
