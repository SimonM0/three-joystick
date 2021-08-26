/**
 * Helper for converting degrees to radians
 *
 * @param degrees
 */
const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export default degreesToRadians;
