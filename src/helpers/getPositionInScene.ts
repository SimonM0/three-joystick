import { PerspectiveCamera, Vector3 } from 'three';

/**
 * Takes a touch point and converts it to a vector that represents that
 * position in the 3d world
 */
const getPositionInScene = (
  touch: Touch,
  camera: PerspectiveCamera,
  scale = 10,
): Vector3 => {
  const relativeX = (touch.clientX / window.innerWidth) * 2 - 1;
  const relativeY = -(touch.clientY / window.innerHeight) * 2 + 1;

  const inSceneTouchVector = new Vector3(relativeX, relativeY, 0)
    .unproject(camera)
    .sub(camera.position)
    .normalize()
    .multiplyScalar(scale);

  return camera
    .position
    .clone()
    .add(inSceneTouchVector);
};

export default getPositionInScene;
