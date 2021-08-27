import { Vector2 } from 'three';

const userSwipedMoreThan = (
  touchEnd: TouchEvent,
  touchStart: Vector2,
  minDistance: number,
): boolean => {
  const distance = touchEnd.touches?.item(0);

  if (distance === null) {
    return false;
  }

  const xDistance = Math.abs(touchStart.x - distance.clientX);
  const yDistance = Math.abs(touchStart.y - distance.clientY);

  return (
    (xDistance > minDistance) ||
    (yDistance > minDistance)
  );
};

export default userSwipedMoreThan;
