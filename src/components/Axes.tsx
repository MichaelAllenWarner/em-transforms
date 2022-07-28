import * as THREE from 'three'

const origin = new THREE.Vector3(0, 0, 0)
const x = new THREE.Vector3(1, 0, 0)
const y = new THREE.Vector3(0, 1, 0)
const z = new THREE.Vector3(0, 0, 1)
const length = 5
const color = 0x00
const axes = [x, y, z].map(
  (vector) => new THREE.ArrowHelper(vector, origin, length, color)
)

const Axes = () => {
  console.log('Axes rerendering')
  return (
    <>
      {axes.map((axis, i) => (
        <primitive key={i} object={axis} />
      ))}
    </>
  )
}

export default Axes
