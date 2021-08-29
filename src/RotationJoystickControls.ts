import JoystickControls from './JoystickControls';
import { Object3D, PerspectiveCamera, Quaternion, Scene, Vector3 } from 'three';

/**
 * A joystick controller that can be used to rotate a target mesh
 * in a scene
 */
class RotationJoystickControls extends JoystickControls {
  /**
   * Target object to control
   */
  public target: Object3D;
  /**
   * Used for scaling down the delta value of x and y
   * that is passed to the update function's call back.
   * You can use this to scale down user movement for controlling
   * the speed.
   */
  public deltaScale = 0.001;
  /**
   * Used for determining which axis the up/down movement of
   * the joystick influences
   */
  public verticalMovementAxis: Vector3 = new Vector3(1, 0, 0);
  /**
   * Used for determining which axis the left/right movement of
   * the joystick influences
   */
  public horizontalMovementAxis: Vector3 = new Vector3(0, 1, 0);
  /**
   * This is a reference quarternion used for keeping track of the
   * movement
   */
  public quaternion: Quaternion = new Quaternion();

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    target: Object3D,
  ) {
    super(camera, scene);
    this.target = target;
  }

  /**
   * Converts and applies the angle in radians provided, to the
   * vertical movement axis specified, in the reference quarternion.
   *
   * @param angleInRadians
   */
  private rotateVerticalMovement = (angleInRadians: number) => {
    this.quaternion.setFromAxisAngle(
      this.verticalMovementAxis, angleInRadians,
    );

    this.target.quaternion.premultiply(
      this.quaternion,
    );
  };

  /**
   * Converts and applies the angle in radians provided, to the
   * horizontal movement axis specified, in the reference quarternion.
   *
   * @param angleInRadians
   */
  private rotateHorizontalMovement = (angleInRadians: number) => {
    this.quaternion.setFromAxisAngle(
      this.horizontalMovementAxis, angleInRadians,
    );

    this.target.quaternion.premultiply(
      this.quaternion,
    );
  };

  /**
   * Call this function in the animate loop to update
   * the rotation of the target mesh
   */
  public update = (): void => {
    const joystickMovement = this.getJoystickMovement();

    if (joystickMovement) {
      this.rotateVerticalMovement(
        joystickMovement.moveY * this.deltaScale,
      );

      this.rotateHorizontalMovement(
        joystickMovement.moveX * this.deltaScale,
      );
    }
  };
}

export default RotationJoystickControls;
