import {
  MeshLambertMaterial,
  CircleGeometry,
  Mesh,
  Scene,
  Vector2,
  Vector3,
  Quaternion,
  PerspectiveCamera,
  Object3D,
} from 'three';
import isTouchOutOfBounds from './helpers/isTouchOutOfBounds';

const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

class JoystickControls {
  scene: Scene;
  camera: PerspectiveCamera;
  joystickTouchZone = 75;
  environment: Object3D = new Object3D();
  quaternion: Quaternion = new Quaternion();
  xAxis = new Vector3(1, 0, 0);
  yAxis = new Vector3(0, 1, 0);
  rotateFactor = 0.0005;
  /**
   * Timestamp of when the user touched the screen.
   * This is used for de-bouncing the user interaction
   */
  touchStart = 0;
  /**
   * Anchor of the joystick base
   */
  baseAnchorPoint: Vector2 = new Vector2();
  /**
   * Current point of the joystick ball
   */
  ballAnchorPoint: Vector2 = new Vector2();
  /**
   * Function that allows you to prevent the joystick
   * from attaching
   */
  preventAction: () => boolean = () => false;
  /**
   * The minimum distance required for the joystick to
   * activate. Defaults to 50px
   */
  activateAfterPixelDistance = 50;
  /**
   * Creation of joystick triggered
   */
  isActive = false;
  /**
   * Creation of joystick complete
   */
  joystickIsActive = false;
  /**
   * Use mesh for now
   *
   * TODO: Make this outside the joystick
   */
  target: Object3D;

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
    target: Object3D,
  ) {
    this.camera = camera;
    this.scene = scene;
    this.target = target;
    this.createTouchEventListeners();
  }

  /**
   * This is used to determine whether a user has tapped/clicked or
   * swiped/dragged
   *
   * @param debounceInMs
   * @returns {boolean}
   */
  private debounceTime = (debounceInMs: number) => (
    (Date.now() - this.touchStart) < debounceInMs
  );

  public update = (): void => {
    this.createRotation();
  };

  /**
   * TODO: Find out why we don't do iPhone
   */
  private isAndroid = (event: TouchEvent) => {
    if (navigator.userAgent.match(/Android/i)) {
      event.preventDefault();
    }
  };

  private swipeDistanceIsMoreThan = (touch: TouchEvent) => {
    const distance = touch.touches?.item(0);

    if (distance === null) {
      return;
    }

    const xDistance = Math.abs(this.baseAnchorPoint.x - distance.clientX);
    const yDistance = Math.abs(this.baseAnchorPoint.y - distance.clientY);

    return (
      (xDistance > this.activateAfterPixelDistance) ||
      (yDistance > this.activateAfterPixelDistance)
    );
  };


  private createCircle = (
    name: string,
    position: Vector3,
    color: number,
    size: number,
  ) => {
    const geometry = new CircleGeometry(size, 72);
    const material = new MeshLambertMaterial({
      color: color,
      opacity: 0.5,
    });
    material.transparent = true;
    const joyStickBaseCircle = new Mesh(geometry, material);
    joyStickBaseCircle.name = name;
    joyStickBaseCircle.position.copy(position);
    this.scene.add(joyStickBaseCircle);
  };

  private updateJoystickBallPosition = (event: TouchEvent) => {
    const joyStickBase = this.scene.getObjectByName('joystick-base');
    const joyStickBall = this.scene.getObjectByName('joystick-ball');
    const zoomScale = 1 / this.camera.zoom;
    const touch = event.touches.item(0);

    if (touch === null) {
      return;
    }

    // TODO: Set min, max and hotzone once to this
    const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
    const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
    const vector = new Vector3(touchX, touchY, 0.5).unproject(this.camera);
    let direction = vector.sub(this.camera.position).normalize();
    let position = this.camera.position.clone()
      .add(direction.multiplyScalar(10));

    if (joyStickBase && joyStickBall) {
      if (isTouchOutOfBounds(touch, this.baseAnchorPoint, this.joystickTouchZone)) {
        console.log('Outside Base');
        const angle = Math.atan2(
          touch.clientY - this.baseAnchorPoint.y,
          touch.clientX - this.baseAnchorPoint.x,
        ) - degreesToRadians(90);
        const xDistance = Math.sin(angle) * this.joystickTouchZone;
        const yDistance = Math.cos(angle) * this.joystickTouchZone;
        direction = new Vector3(-xDistance, -yDistance, 0).normalize();
        position = joyStickBase.position.clone().add(direction);
      } else {
        console.log('Inside Base');
      }
      joyStickBall.position.copy(position);
      return;
    }

    //** Joystick Base Position
    this.createCircle('joystick-base', position, 0x666666, 0.9 * zoomScale);
    this.createCircle('joystick-ball', position, 0x444444, 0.5 * zoomScale);
    this.joystickIsActive = true;
  };

  private removeJoystick = () => {
    const joystickBase = this.scene.getObjectByName('joystick-base');
    const joyStickBall = this.scene.getObjectByName('joystick-ball');

    if (joystickBase && joyStickBall) {
      this.scene.remove(joystickBase);
      this.scene.remove(joyStickBall);
    }

    this.joystickIsActive = false;
  };

  /**
   * Rotates the environment
   * @param axis
   * @param angle
   */
  private rotate = (axis: Vector3, angle: number) => {
    this.quaternion.setFromAxisAngle(axis, angle);
    this.target?.quaternion.premultiply(this.quaternion);
  };

  /**
   * createRotation function used to calculate the amount of rotation
   */
  private createRotation = (): void => {
    if (!this.isActive) {
      return;
    }

    /**
     * TODO: xAxis and yAxis must be set
     */
    const moveX = this.ballAnchorPoint.x - this.baseAnchorPoint.x;
    const moveY = this.ballAnchorPoint.y - this.baseAnchorPoint.y;

    this.rotate(this.yAxis, moveX * this.rotateFactor);
    this.rotate(this.xAxis, moveY * this.rotateFactor);
  };

  destroyTouchEventListeners = (): void => {
    /**
     * TODO: Remove event listeners from the document
     */
  };

  private createTouchEventListeners = () => {
    document.addEventListener('touchstart', (event: TouchEvent) => {
      if (this.preventAction()) {
        return;
      }

      const touch = event.touches.item(0);

      if (touch === null) {
        return;
      }

      this.baseAnchorPoint = new Vector2(touch.clientX, touch.clientY);
      this.touchStart = Date.now();
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      if (this.debounceTime(150) && this.swipeDistanceIsMoreThan(event)) {
        // Return because we tapped instead
        return;
      }

      this.isActive = true;

      if (this.preventAction()) {
        return;
      }

      const touch = event.touches.item(0);

      if (!this.isActive) {
        return;
      }

      this.ballAnchorPoint = new Vector2(touch?.clientX, touch?.clientY);
      this.updateJoystickBallPosition(event);
    });

    document.addEventListener('touchend', () => {
      if (this.debounceTime(150) || !this.joystickIsActive) {
        return;
      }

      this.touchStart = 0;

      this.removeJoystick();

      setTimeout(() => {
        this.isActive = false;
      }, 150);
    });
  };
}

export default JoystickControls;
