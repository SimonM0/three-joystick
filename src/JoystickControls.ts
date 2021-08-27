import {
  MeshLambertMaterial,
  CircleGeometry,
  Mesh,
  Scene,
  Vector2,
  Vector3,
  PerspectiveCamera,
  Object3D,
} from 'three';
import isTouchOutOfBounds from './helpers/isTouchOutOfBounds';
import degreesToRadians from './helpers/degreesToRadians';
import getPositionInScene from './helpers/getPositionInScene';

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
   * True wehn the joystick has been attached to the scene
   */
  isJoystickAttached = false;
  /**
   * Setting joystickScale will scale the joystick up or down in size
   */
  joystickScale = 10;

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

  private handleTouchStart = (event: TouchEvent) => {
    if (this.preventAction()) {
      return;
    }

    const touch = event.touches.item(0);

    if (touch === null) {
      return;
    }

    this.baseAnchorPoint = new Vector2(touch.clientX, touch.clientY);
  };

  private handleTouchMove = (event: TouchEvent) => {
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

    this.scene.getObjectByName('joystick-base')?.removeFromParent();
    this.scene.getObjectByName('joystick-ball')?.removeFromParent();

    this.isJoystickAttached = false;
  };

  /**
   * Draws the joystick base and ball
   *
   * TODO: Add feature to allow an image to be loaded.
   * TODO: Add option to change color and size of the joystick
   */
  private attachUserInterface = (
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
      transparent: true,
    });
    const uiElement = new Mesh(geometry, material);

    uiElement.name = name;
    uiElement.position.copy(position);

    this.scene.add(uiElement);
  };

  private attachJoystick = (positionInScene: Vector3) => {
    this.attachUserInterface(
      'joystick-base',
      positionInScene,
      0xFFFFFF,
      0.9,
    );
    this.attachUserInterface(
      'joystick-ball',
      positionInScene,
      0xCCCCCC,
      0.5,
    );

    this.isJoystickAttached = true;
  };

  private getJoystickBallPosition = (
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

    const positionInScene = getPositionInScene(
      touch,
      this.camera,
      this.joystickScale,
    );

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

  /**
   * Calculates and returns the distance the user has moved the
   * joystick from the center of the joystick base.
   */
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
