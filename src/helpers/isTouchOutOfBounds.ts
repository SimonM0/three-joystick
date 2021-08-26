import { Vector2 } from 'three';

/**
 * Used for checking if the touch point is within a perimeter that
 * is defined by the param perimeterSize.
 *
 * Uses Pythagoras' Theorem to calculate the distance from the origin
 *
 * @param touchedPoint
 * @param origin
 * @param perimeterSize
 */
const isTouchOutOfBounds = (
  touchedPoint: Touch,
  origin: Vector2,
  perimeterSize: number,
): boolean => {
  const xDelta = (touchedPoint.clientX - origin.x);
  const yDelta = (touchedPoint.clientY - origin.y);
  const xSquared = Math.pow(xDelta, 2);
  const ySquared = Math.pow(yDelta, 2);
  const distanceFromTheOrigin = Math.sqrt(xSquared + ySquared);

  return (perimeterSize <= distanceFromTheOrigin);
};

export default isTouchOutOfBounds;
