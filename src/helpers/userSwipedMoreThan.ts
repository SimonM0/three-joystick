import { Vector2 } from 'three';

const userSwipedMoreThan = (
  clientX: number,
  clientY: number,
  touchStart: Vector2,
  minDistance: number,
): boolean => {
  const xDistance = Math.abs(touchStart.x - clientX);
  const yDistance = Math.abs(touchStart.y - clientY);

  return (
    (xDistance > minDistance) ||
    (yDistance > minDistance)
  );
};

export default userSwipedMoreThan;
