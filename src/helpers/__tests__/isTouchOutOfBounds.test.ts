import isTouchOutOfBounds from '../isTouchOutOfBounds';
import { Vector2 } from 'three';

describe('isTouchOutOfBounds', () => {
  test.each(
    [
      [
        'return false if the touched point is in the NE quadrant and not out of bounds',
        7,
        7,
        false,
      ],
      [
        'return true if the touched point is in the NE quadrant and out of bounds',
        11,
        11,
        true,
      ],
      [
        'return false if the touched point is in the NW quadrant and not out of bounds',
        -7,
        7,
        false,
      ],
      [
        'return true if the touched point is in the NW quadrant and out of bounds',
        -11,
        11,
        true,
      ],
      [
        'return false if the touched point is in the SE quadrant and not out of bounds',
        7,
        -7,
        false,
      ],
      [
        'return true if the touched point is in the SE quadrant and out of bounds',
        11,
        -11,
        true,
      ],
      [
        'return false if the touched point is in the SW quadrant and not out of bounds',
        -7,
        -7,
        false,
      ],
      [
        'return true if the touched point is in the SW quadrant and out of bounds',
        -11,
        -11,
        true,
      ],
    ],
  )(
    'should %p',
    (_description, clientX, clientY, result) => {
      const mockBaseAnchorPoint = new Vector2(0, 0);
      const mockPerimeterSize = 10;

      expect(isTouchOutOfBounds(
        clientX,
        clientY,
        mockBaseAnchorPoint,
        mockPerimeterSize,
      )).toEqual(result);
    },
  );
});
