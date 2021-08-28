import getPositionInScene from '../getPositionInScene';
import { PerspectiveCamera, Vector3 } from 'three';

describe('getPositionInScene', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 939,
    });
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1680,
    });
  });

  it('should return convert the given coordinates into the position in the scene', function () {
    const mockClientX = 100;
    const mockClientY = 100;
    const mockCamera = new PerspectiveCamera();

    expect(
      getPositionInScene(
        mockClientX,
        mockClientY,
        mockCamera,
      ),
    ).toEqual(
      new Vector3(
        -3.5981622399601454,
        3.214453547588953,
        -8.759024882104045,
      ),
    );
  });

  it('should return convert the given coordinates into the position in the scene using a custom scale factor', function () {
    const mockClientX = 100;
    const mockClientY = 100;
    const mockCamera = new PerspectiveCamera();
    const mockScaleFactor = 100;

    expect(
      getPositionInScene(
        mockClientX,
        mockClientY,
        mockCamera,
        mockScaleFactor,
      ),
    ).toEqual(
      new Vector3(
        -35.981622399601454,
        32.144535475889526,
        -87.59024882104045,
      ),
    );
  });
});
