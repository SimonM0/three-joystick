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
   * True when user has begun interaction
   */
  interactionHasBegan = false;
  /**
   * True when the joystick has been attached to the scene
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

  /**
   * Touch start event listener
   */
  private handleTouchStart = (event: TouchEvent) => {
    if (this.preventAction()) {
      return;
    }

    const touch = event.touches.item(0);

    if (touch === null) {
      return;
    }

    this.onStart(touch.clientX, touch.clientY);
  };

  /**
   * Mouse down event listener
   */
  private handleMouseDown = (event: MouseEvent) => {
    if (this.preventAction()) {
      return;
    }

    this.onStart(event.clientX, event.clientY);
  };

  /**
   * Plots the anchor point
   */
  private onStart = (clientX: number, clientY: number) => {
    this.baseAnchorPoint = new Vector2(clientX, clientY);
    this.interactionHasBegan = true;
  };

  /**
   * Touch move event listener
   */
  private handleTouchMove = (event: TouchEvent) => {
    if (this.preventAction()) {
      return;
    }

    const touch = event.touches.item(0);

    if (touch) {
      this.onMove(touch.clientX, touch.clientY);
    }
  };

  /**
   * Mouse move event listener
   */
  private handleMouseMove = (event: MouseEvent) => {
    if (this.preventAction()) {
      return;
    }

    this.onMove(event.clientX, event.clientY);
  };

  /**
   * Updates the joystick position during user interaction
   */
  private onMove = (clientX: number, clientY: number) => {
    if (!this.interactionHasBegan) {
      return;
    }

    this.touchPoint = new Vector2(clientX, clientY);

    const positionInScene = getPositionInScene(
      clientX,
      clientY,
      this.camera,
      this.joystickScale,
    );

    if (!this.isJoystickAttached) {
      /**
       * If there is no base or ball, then we need to attach the joystick
       */
      return this.attachJoystick(positionInScene);
    }

    this.updateJoystickBallPosition(clientX, clientY, positionInScene);
  };

  /**
   * Clean up joystick when the user interaction has finished
   */
  private handleTouchEnd = () => {
    if (!this.isJoystickAttached) {
      return;
    }

    this.scene.getObjectByName('joystick-base')?.removeFromParent();
    this.scene.getObjectByName('joystick-ball')?.removeFromParent();

    this.isJoystickAttached = false;
    this.interactionHasBegan = false;
  };

  /**
   * Draws the joystick base and ball
   *
   * TODO: Add feature to allow an image to be loaded.
   * TODO: Add option to change color and size of the joystick
   */
  private attachJoystickUI = (
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

  /**
   * Creates the ball and base of the joystick
   */
  private attachJoystick = (positionInScene: Vector3) => {
    this.attachJoystickUI(
      'joystick-base',
      positionInScene,
      0xFFFFFF,
      0.9,
    );
    this.attachJoystickUI(
      'joystick-ball',
      positionInScene,
      0xCCCCCC,
      0.5,
    );

    this.isJoystickAttached = true;
  };

  /**
   * Calculates if the touch point was outside the joystick and
   * either returns the joystick ball position bound to the perimeter of
   * the base, or the position inside the base.
   */
  private getJoystickBallPosition = (
    clientX: number,
    clientY: number,
    positionInScene: Vector3,
  ): Vector3 => {
    const touchWasOutsideJoystick = isTouchOutOfBounds(
      clientX,
      clientY,
      this.baseAnchorPoint,
      this.joystickTouchZone,
    );

    if (touchWasOutsideJoystick) {
      /**
       * Touch was outside Base so restrict the ball to the base perimeter
       */
      const angle = Math.atan2(
        clientY - this.baseAnchorPoint.y,
        clientX - this.baseAnchorPoint.x,
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
    }

    /**
     * Touch was inside the Base so just set the joystick ball to that
     * position
     */
    return positionInScene;
  };

  /**
   * Attaches the joystick or updates the joystick ball position
   */
  private updateJoystickBallPosition = (
    clientX: number,
    clientY: number,
    positionInScene: Vector3,
  ) => {
    const joyStickBall = this.scene.getObjectByName('joystick-ball');
    const joystickBallPosition = this.getJoystickBallPosition(
      clientX,
      clientY,
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
   * Adds event listeners to the document
   */
  public create = (): void => {
    window.addEventListener('touchstart', this.handleTouchStart);
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleTouchEnd);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleTouchEnd);
  };

  /**
   * Removes event listeners from the document
   */
  public destroy = (): void => {
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleTouchEnd);
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
