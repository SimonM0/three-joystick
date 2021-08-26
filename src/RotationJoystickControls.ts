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
  public deltaScale = 0.0005;
  private xAxis: Vector3 = new Vector3(1, 0, 0);
  private yAxis: Vector3 = new Vector3(0, 1, 0);
  private quaternion: Quaternion = new Quaternion();

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    target: Object3D,
  ) {
    super(camera, scene);
    this.target = target;
  }

  private rotateAroundYAxis = (angle: number) => {
    this.quaternion.setFromAxisAngle(this.yAxis, angle);
    this.target.quaternion.premultiply(this.quaternion);
  };

  private rotateAroundXAxis = (angle: number) => {
    this.quaternion.setFromAxisAngle(this.xAxis, angle);
    this.target.quaternion.premultiply(this.quaternion);
  };

  public update = (): void => {
    const movement = this.getMovement();

    if (movement) {
      this.rotateAroundXAxis(movement.moveX * this.deltaScale);
      this.rotateAroundYAxis(movement.moveY * this.deltaScale);
    }
  }
}

export default RotationJoystickControls;
