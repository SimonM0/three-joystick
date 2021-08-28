import RotationJoystickControls from '../RotationJoystickControls';
import * as THREE from 'three';
import { Quaternion } from 'three';

const mockSwipe = (clientX = 128, clientY = 128) => {
  const touchStart = new TouchEvent('touchstart', {});
  touchStart.touches.item = () => ({
    clientX: 0,
    clientY: 0,
  } as Touch);
  const touchMove = new TouchEvent('touchmove', {});
  touchMove.touches.item = () => ({
    clientX,
    clientY,
  } as Touch);
  window.dispatchEvent(touchStart);
  window.dispatchEvent(touchMove);
};

describe('RotationJoystickControls', () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const target = new THREE.Mesh();

  beforeEach(() => {
    target.quaternion.set(0, 0, 0, 0);
  });

  it('should rotate the vertical movement axis', () => {
    const controls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );
    const spyOnRotateVerticalMovement = jest.spyOn(
      controls,
      // @ts-ignore
      'rotateVerticalMovement',
    );

    mockSwipe();

    controls.update();

    expect(spyOnRotateVerticalMovement).toHaveBeenCalledWith(0.128);
  });

  it('should not rotate the vertical movement axis', () => {
    const controls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );
    const spyOnRotateVerticalMovement = jest.spyOn(
      controls,
      // @ts-ignore
      'rotateVerticalMovement',
    );

    controls.update();

    expect(spyOnRotateVerticalMovement).not.toHaveBeenCalled();
  });

  it('should invoke rotateHorizontalMovement with the angle 0.128', () => {
    const controls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );
    const spyOnRotateHorizontalMovement = jest.spyOn(
      controls,
      // @ts-ignore
      'rotateHorizontalMovement',
    );

    mockSwipe();

    controls.update();

    expect(spyOnRotateHorizontalMovement).toHaveBeenCalledWith(0.128);
  });

  it('should not rotate the horizontal movement axis', () => {
    const controls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );
    const spyOnRotateHorizontalMovement = jest.spyOn(
      controls,
      // @ts-ignore
      'rotateHorizontalMovement',
    );

    controls.update();

    expect(spyOnRotateHorizontalMovement).not.toHaveBeenCalled();
  });

  it('should set the reference quarternion fromthe axis angle', () => {
    const controls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );

    mockSwipe();

    controls.update();

    expect(controls.quaternion).toEqual(
      new Quaternion(
        0,
        0.06395631828030929,
        0,
        0.99795269895523,
      ),
    );
  });
});
