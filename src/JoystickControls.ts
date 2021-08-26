import {
  MeshLambertMaterial,
  CircleGeometry,
  Mesh,
  Scene,
  Vector2,
  Vector3,
  PerspectiveCamera, Object3D,
} from 'three';
import isTouchOutOfBounds from './helpers/isTouchOutOfBounds';
import debounceTime from './helpers/debounceTime';
import degreesToRadians from './helpers/degreesToRadians';

class JoystickControls {
  /**
   * This is the three.js scene
   */
  scene: Scene;
  /**
   * This is the three.js  camera
   */
  camera: PerspectiveCamera;
  /**
   * This is used to detect if the user has moved outside the
   * joystick base. It will snap the joystick ball to the bounds
   * of the base of the joystick
   *
   * TODO: Needs fixing because the pixel change does not correlate to the
   * TODO: canvas so it currently jumps
   */
  joystickTouchZone = 75;
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
  touchPoint: Vector2 = new Vector2();
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
   * True wehn the joystick has been attached to the scene
   */
  isJoystickAttached = false;

  constructor(
    camera: PerspectiveCamera,
    scene: Scene,
  ) {
    this.camera = camera;
    this.scene = scene;

    this.create();
  }

  public create = (): void => {
    document.addEventListener('touchstart', this.handleTouchStart);
    document.addEventListener('touchmove', this.handleTouchMove);
    document.addEventListener('touchend', this.handleTouchEnd);
  };

  public destroy = (): void => {
    document.removeEventListener('touchstart', this.handleTouchStart);
    document.removeEventListener('touchmove', this.handleTouchMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
  };

  /**
   * TODO Extract as helper
   * @param touch
   */
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

  /**
   * Draws the joystick base and ball
   *
   * TODO: Add feature to allow an image to be loaded.
   * TODO: Add option to change color and size of the joystick
   */
  private createCircle = (
    name: string,
    position: Vector3,
    color: number,
    size: number,
  ) => {
    const zoomScale = 1 / this.camera.zoom;
    const geometry = new CircleGeometry(size * zoomScale, 72);
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

  private attachJoystick = (positionInScene: Vector3) => {
    //** Joystick Base Position
    this.createCircle('joystick-base', positionInScene, 0x666666, 0.9);
    this.createCircle('joystick-ball', positionInScene, 0x444444, 0.5);
    this.isJoystickAttached = true;
  };

  getJoystickBallPosition = (
    touch: Touch,
    positionInScene: Vector3,
  ): Vector3 => {
    if (!isTouchOutOfBounds(touch, this.baseAnchorPoint, this.joystickTouchZone)) {
      /**
       * Touch was inside the Base so just set the joystick ball to that
       * position
       */
      return positionInScene;
    }

    /**
     * Touch was outside Base so restrict the ball to the base perimeter
     */
    const angle = Math.atan2(
      touch.clientY - this.baseAnchorPoint.y,
      touch.clientX - this.baseAnchorPoint.x,
    ) - degreesToRadians(90);
    const xDistance = Math.sin(angle) * this.joystickTouchZone;
    const yDistance = Math.cos(angle) * this.joystickTouchZone;
    const direction = new Vector3(-xDistance, -yDistance, 0).normalize();
    const joyStickBase = this.scene.getObjectByName('joystick-base');

    /**
     * positionInScene restricted to the perimeter of the joystick
     * base
     */
    return (joyStickBase as Object3D).position.clone().add(direction);
  };

  private updateJoystickBallPosition = (event: TouchEvent) => {
    const touch = event.touches.item(0);

    if (touch === null) {
      return;
    }

    const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
    const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
    const vector = new Vector3(touchX, touchY, 0.5)
      .unproject(this.camera);
    const direction = vector
      .sub(this.camera.position)
      .normalize();
    const positionInScene = this
      .camera
      .position
      .clone()
      .add(direction.multiplyScalar(10));

    if (!this.isJoystickAttached) {
      /**
       * If there is no base or ball, then we need to attach the joystick
       */
      return this.attachJoystick(positionInScene);
    }

    const joyStickBall = this.scene.getObjectByName('joystick-ball');
    const joystickBallPosition = this.getJoystickBallPosition(
      touch,
      positionInScene,
    );

    /**
     * Inside Base so just copy the position
     */
    joyStickBall?.position.copy(joystickBallPosition);
  };

  private removeJoystick = () => {
    this.scene.getObjectByName('joystick-base')?.removeFromParent();
    this.scene.getObjectByName('joystick-ball')?.removeFromParent();

    this.isJoystickAttached = false;
  };

  private handleTouchStart = (event: TouchEvent) => {
    if (this.preventAction()) {
      return;
    }

    const touch = event.touches.item(0);

    if (touch === null) {
      return;
    }

    this.baseAnchorPoint = new Vector2(touch.clientX, touch.clientY);
    this.touchStart = Date.now();
  };

  private handleTouchMove = (event: TouchEvent) => {
    if (debounceTime(this.touchStart) && this.swipeDistanceIsMoreThan(event)) {
      // Return because we tapped instead
      console.log('d');
      return;
    }

    if (this.preventAction()) {
      return;
    }

    const touch = event.touches.item(0);

    this.touchPoint = new Vector2(touch?.clientX, touch?.clientY);

    this.updateJoystickBallPosition(event);
  };

  private handleTouchEnd = () => {
    if (!this.isJoystickAttached) {
      return;
    }

    this.touchStart = 0;

    this.removeJoystick();
  };

  protected getJoystickMovement = (): TMovement | null => {
    if (!this.isJoystickAttached) {
      return null;
    }

    return {
      moveX: this.touchPoint.y - this.baseAnchorPoint.y,
      moveY: this.touchPoint.x - this.baseAnchorPoint.x,
    };
  };

  /**
   * function that updates the positioning, this needs to be called
   * in the animation loop
   */
  public update = (callback?: (movement?: TMovement | null) => void): void => {
    const movement = this.getJoystickMovement();

    callback?.(movement);
  };
}

export default JoystickControls;
