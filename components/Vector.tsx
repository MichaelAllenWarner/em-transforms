import * as THREE from 'three'
import { type CartesianComponents } from '../helpers/store'
import { font } from '../helpers/font'

interface Props {
  components: CartesianComponents
  color?: string
  label?: string
}

const origin = new THREE.Vector3(0, 0, 0)

const Vector = ({ components, color, label }: Props) => {
  const vector = new THREE.Vector3(...components)
  const length = vector.length()

  return (
    <>
      <arrowHelper
        args={[vector.normalize(), origin, length, color, 0.2, 0.1]}
      />
      {label && (
        <mesh
          position={components.map((component) =>
            component < 0 ? component - 0.05 : component + 0.05
          ) as CartesianComponents}
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
          <meshLambertMaterial color={color} />
        </mesh>
      )}
    </>
  )
}

export default Vector
