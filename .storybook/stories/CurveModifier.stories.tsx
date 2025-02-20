import React from 'react'
import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, LineLoop, Vector3 } from 'three'
import { FontLoader, TextGeometry } from 'three-stdlib'
import { extend, useFrame, useLoader } from '@react-three/fiber'

import { Setup } from '../Setup'
import { CurveModifier, CurveModifierRef } from '../../src'

extend({ TextGeometry })

export default {
  title: 'Modifiers/CurveModifier',
  component: CurveModifier,
  decorators: [(storyFn) => <Setup>{storyFn()}</Setup>],
}

function CurveModifierScene() {
  const curveRef = React.useRef<CurveModifierRef>()
  const geomRef = React.useRef<TextGeometry>(null!)
  const font = useLoader(FontLoader, '/fonts/helvetiker_regular.typeface.json')

  const handlePos = React.useMemo(
    () =>
      [
        { x: 10, y: 0, z: -10 },
        { x: 10, y: 0, z: 10 },
        { x: -10, y: 0, z: 10 },
        { x: -10, y: 0, z: -10 },
      ].map((hand) => new Vector3(...Object.values(hand))),
    []
  )

  const curve = React.useMemo(() => new CatmullRomCurve3(handlePos, true, 'centripetal'), [handlePos])

  const line = React.useMemo(
    () =>
      new LineLoop(new BufferGeometry().setFromPoints(curve.getPoints(50)), new LineBasicMaterial({ color: 0x00ff00 })),
    [curve]
  )

  useFrame(() => {
    if (curveRef.current) {
      curveRef.current?.moveAlongCurve(0.001)
    }
  })

  React.useEffect(() => {
    geomRef.current.rotateX(Math.PI)
  }, [])

  return (
    <>
      <CurveModifier ref={curveRef} curve={curve}>
        <mesh>
          <textGeometry
            args={[
              'hello @react-three/drei',
              {
                font,
                size: 1,
                height: 1,
              },
            ]}
            ref={geomRef}
          />
          <meshNormalMaterial />
        </mesh>
      </CurveModifier>
      <primitive object={line} />
    </>
  )
}

export const CurveModifierSt = () => (
  <React.Suspense fallback={null}>
    <CurveModifierScene />
  </React.Suspense>
)
CurveModifierSt.storyName = 'Default'
