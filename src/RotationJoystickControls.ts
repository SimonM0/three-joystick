import JoystickControls from './JoystickControls';
import { Object3D, PerspectiveCamera, Quaternion, Scene, Vector3 } from 'three';

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
   * TODO: Document the reassigning axis feature
   *
   * @example rotationJoystick.verticalMovementAxis = new Vector3(0, 0, 1);
   */
  public verticalMovementAxis: Vector3 = new Vector3(1, 0, 0);
  public horzontalMovementAxis: Vector3 = new Vector3(0, 1, 0);
  private quaternion: Quaternion = new Quaternion();

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    target: Object3D,
  ) {
    super(camera, scene);
    this.target = target;
  }

  private rotateVerticalMovement = (angle: number) => {
    this.quaternion.setFromAxisAngle(this.verticalMovementAxis, angle);
    this.target.quaternion.premultiply(this.quaternion);
  };

  private rotateHorzontalMovement = (angle: number) => {
    this.quaternion.setFromAxisAngle(this.horzontalMovementAxis, angle);
    this.target.quaternion.premultiply(this.quaternion);
  };


  public update = (): void => {
    const joystickMovement = this.getJoystickMovement();

    if (joystickMovement) {
      this.rotateVerticalMovement(joystickMovement.moveX * this.deltaScale);
      this.rotateHorzontalMovement(joystickMovement.moveY * this.deltaScale);
    }
  }
}

export default RotationJoystickControls;
