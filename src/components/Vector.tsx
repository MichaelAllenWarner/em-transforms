import { ReactThreeFiber, extend } from '@react-three/fiber'
import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import useStore from '@/helpers/store'
import shallow from 'zustand/shallow'
import { type CartesianComponents } from '@/helpers/store'

// Add class `Line` as `Line_` to react-three-fiber's extend function. This
// makes it so that when you use <line_> in a <Canvas>, the three reconciler
// will use the class `Line`
extend({ Line_: THREE.Line })

// declare `line_` as a JSX element so that typescript doesn't complain
declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof THREE.Line>
    }
  }
}

interface Props {
  components: CartesianComponents
  color?: string
}

const Vector = ({ components, color }: Props) => {
  const ref = useRef<THREE.Line>(null)
  useFrame(() => {
    if (ref.current) {
      ref.current.geometry.setFromPoints(
        [[0, 0, 0], components].map((point) => new THREE.Vector3(...point))
      )
      // ref.current.rotation.x += 0.01
    }
  })

  return (
    <line_ ref={ref}>
      <bufferGeometry attach='geometry' />
      <lineBasicMaterial attach='material' color={color} />
    </line_>
  )
}

export default Vector
