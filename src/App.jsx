import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { OrbitControls, MeshWobbleMaterial, useHelper } from '@react-three/drei'
import { DirectionalLightHelper } from 'three'
import { useControls } from 'leva'

import './App.css'

const Cube = ({ position, size, color }) => {
  const ref = useRef()

  useFrame((state, delta) => {
    ref.current.rotation.x += delta
    ref.current.rotation.y += delta * 2.0
    ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
  })

  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const Sphere = ({ position, size, color }) => {
  const ref = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)


  useFrame((state, delta) => {
    const speed = isHovered ? 1 : 0.2
    ref.current.rotation.y += delta * speed
  })
  return (
    <mesh
      position={position}
      ref={ref}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
      scale={isClicked ? 1.5 : 1}

    >
      <sphereGeometry args={size} />
      <meshStandardMaterial color={isHovered ? "orange" : "lightBlue"} wireframe />
    </mesh>
  )
}

const Torus = ({ position, size, color }) => {
  return (
    <mesh position={position}>
      <torusGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const TorusKnot = ({ position, size }) => {
  const ref = useRef()

  // useFrame((state, delta) => {
  //   ref.current.rotation.x += delta
  //   ref.current.rotation.y += delta * 2.0
  //   ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
  // })

  const { color, radius } = useControls({
    color: "lightBlue",
    radius: {
      value: 5,
      max: 10,
      min: 1,
      step: 0.5,
    }
  })
  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={[radius, ...size]} />
      {/* <meshStandardMaterial color={color} /> */}
      <MeshWobbleMaterial factor={5} speed={2} color={color}/>
    </mesh>
  )
}

const Scene = () => {
  const directionalLightRef = useRef()
  const { lightColor, lightIntensity } = useControls({
    lightColor: "white",
    lightIntensity: {
      value: 0.5,
      max: 5,
      min: 0,
      step: 0.1,
    }
  })
  useHelper(directionalLightRef, DirectionalLightHelper, 0.5, "white")



  return (
    <>
      <directionalLight
        position={[0, 1, 2]}
        intensity={lightIntensity}
        ref={directionalLightRef}
        color={lightColor}
      />
      <ambientLight intensity={0.1} />
      {/* <group position={[0, -1, 0]}>
      <Cube position={[1, 0, 0]} size={[1, 1, 1]} color={"green"} />
      <Cube position={[-1, 0, 0]} size={[1, 1, 1]} color={"orange"} />
      <Cube position={[1, 2, 0]} size={[1, 1, 1]} color={"grey"} />
      <Cube position={[-1, 2, 0]} size={[1, 1, 1]} color={"blue"} />
    </group> */}

      {/* <Cube position={[0, 0, 0]} size={[1, 1, 1]} color={"orange"}/> */}

      {/* <Sphere position={[0, 0, 0]} size={[1, 30, 30]} color={"orange"} /> */}
      {/* <Torus position={[2, 0, 0]} size={[0.8, 0.1, 30, 30]} color={"blue"} /> */}
      <TorusKnot position={[0, 0, 0]} size={[0.1, 1000, 50]} color={"hotpink"} />
      <OrbitControls enableZoom={false} />
    </>
  )
}

const App = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  )
}

export default App
