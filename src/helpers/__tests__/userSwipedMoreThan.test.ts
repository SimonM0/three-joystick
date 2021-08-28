import userSwipedMoreThan from '../userSwipedMoreThan';
import { Vector2 } from 'three';

describe('userSwipedMoreThan', () => {
  const mockTouchStart = new Vector2(0, 0);
  const mockMinDistance = 100;

  it('should return true if the user swiped more than the minDistance in the x axis', function () {
    const mockClientX = 101;
    const mockClientY = 0;

    expect(
      userSwipedMoreThan(
        mockClientX,
        mockClientY,
        mockTouchStart,
        mockMinDistance
      )
    ).toEqual(true);
  });

  it('should return false if the user did not swipe more than the minDistance in the x axis', function () {
    const mockClientX = 100;
    const mockClientY = 0;

    expect(
      userSwipedMoreThan(
        mockClientX,
        mockClientY,
        mockTouchStart,
        mockMinDistance
      )
    ).toEqual(false);
  });

  it('should return true if the user swiped more than the minDistance in the y axis', function () {
    const mockClientX = 0;
    const mockClientY = 101;

    expect(
      userSwipedMoreThan(
        mockClientX,
        mockClientY,
        mockTouchStart,
        mockMinDistance
      )
    ).toEqual(true);
  });

  it('should return false if the user did not swipe more than the minDistance in the y axis', function () {
    const mockClientX = 0;
    const mockClientY = 100;

    expect(
      userSwipedMoreThan(
        mockClientX,
        mockClientY,
        mockTouchStart,
        mockMinDistance
      )
    ).toEqual(false);
  });
});
