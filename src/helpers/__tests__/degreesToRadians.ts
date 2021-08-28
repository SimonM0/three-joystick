import degreesToRadians from '../degreesToRadians';

describe('degreesToRadians', () => {
  test.each([
    [0, 0],
    [45, 0.7853981633974483],
    [90, 1.5707963267948966],
    [135, 2.356194490192345],
    [180, 3.141592653589793],
    [225, 3.9269908169872414],
    [270, 4.71238898038469],
    [315, 5.497787143782138],
    [360, 6.283185307179586],
  ])('should convert %d° to %frad', (degrees, radians) => {
    expect(degreesToRadians(degrees)).toEqual(radians);
  });
});
