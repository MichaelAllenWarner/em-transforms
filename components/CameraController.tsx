import { useThree } from '@react-three/fiber';
import { forwardRef, useEffect } from 'react';
import { OrbitControls } from 'three-stdlib';

const CameraController = forwardRef<OrbitControls>((_, ref) => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    if (ref && typeof ref !== 'function') {
      ref.current = controls;
    }
    return () => {
      controls.dispose();
    };
  }, [camera, gl, ref]);
  return null;
});
CameraController.displayName = 'CameraController';

export default CameraController;
