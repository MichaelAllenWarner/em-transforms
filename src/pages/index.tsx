import * as THREE from 'three'
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import useStore, { CartesianComponents } from '@/helpers/store'
import shallow from 'zustand/shallow'
import Vector from '@/components/Vector'
import { OrbitControls } from 'three-stdlib'
import Axes from '@/components/Axes'

const boostUnit: CartesianComponents = [1, 0, 0]

const CameraController = () => {
  const { camera, gl } = useThree()
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement)

    // controls.minDistance = 3
    // controls.maxDistance = 20
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

const cross = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents
): CartesianComponents => [
  a_y * b_z - b_y * a_z,
  a_z * b_x - b_z * a_x,
  a_x * b_y - b_x * a_y,
]
const dot = (
  [a_x, a_y, a_z]: CartesianComponents,
  [b_x, b_y, b_z]: CartesianComponents
) => a_x * b_x + a_y * b_y + a_z * b_z

const Page = () => {
  const {
    eField,
    bField,
    boostRapidity,
    setEField,
    setBField,
    setBoostRapidity,
  } = useStore(
    (state) => ({
      eField: state.eField,
      bField: state.bField,
      boostRapidity: state.boostRapidity,
      setEField: state.setEField,
      setBField: state.setBField,
      setBoostRapidity: state.setBoostRapidity,
    }),
    shallow
  )

  const ch = Math.cosh(boostRapidity)
  const sh = Math.sinh(boostRapidity)
  const sh2 = Math.sinh(boostRapidity / 2) ** 2
  const crossE = cross(boostUnit, eField)
  const crossB = cross(boostUnit, bField)
  const dotE = dot(boostUnit, eField)
  const dotB = dot(boostUnit, bField)

  const ePrime: CartesianComponents = eField.map(
    (comp, i) => ch * comp + sh * crossB[i] - 2 * sh2 * dotE * boostUnit[i]
  )
  const bPrime: CartesianComponents = bField.map(
    (comp, i) => ch * comp - sh * crossE[i] - 2 * sh2 * dotB * boostUnit[i]
  )

  console.log({ ePrime, bPrime })

  return (
    <Canvas>
      <CameraController />
      <ambientLight />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Axes />
      <Vector components={eField} color='blue' />
      <Vector components={bField} color='red' />
      <Vector components={[Math.tanh(boostRapidity), 0, 0]} color='green' />
      <Vector components={ePrime} color='orange' />
      <Vector components={bPrime} color='purple' />
    </Canvas>
  )
}

export default Page
