import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import useStore from '@/helpers/store'
import shallow from 'zustand/shallow'
import Vector from '@/components/Vector'
import { OrbitControls } from 'three-stdlib'

const CameraController = () => {
  const { camera, gl } = useThree()
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)

    controls.minDistance = 3
    controls.maxDistance = 20
    return () => {
      controls.dispose()
    }
  }, [camera, gl])
  return null
}

// const Camera = () => {
//   const camera = useRef()
//   const { aspect, size, setDefaultCamera } = useThree()
//   const pixelToThreeUnitRatio = 1
//   const planeDistance = 0
//   const cameraDistance = 500
//   const distance = cameraDistance - planeDistance
//   const height = size.height / pixelToThreeUnitRatio
//   const halfFovRadians = Math.atan(height / 2 / distance)
//   const fov = 2 * halfFovRadians * (180 / Math.PI)
//   useEffect(() => void setDefaultCamera(camera.current), [])
//   return (
//     <perspectiveCamera
//       ref={camera}
//       aspect={aspect}
//       fov={fov}
//       position={[0, 0, cameraDistance]}
//       onUpdate={(self) => self.updateProjectionMatrix()}
//     />
//   )
// }

const Page = () => {
  const { eField, bField, boost, setEField, setBField, setBoost } = useStore(
    (state) => ({
      eField: state.eField,
      bField: state.bField,
      boost: state.boost,
      setEField: state.setEField,
      setBField: state.setBField,
      setBoost: state.setBoost,
    }),
    shallow
  )

  return (
    <Canvas>
      <CameraController />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Vector components={eField} color='blue' />
      <Vector components={bField} color='red' />
      <Vector components={boost} color='green' />
    </Canvas>
  )
}

export default Page
