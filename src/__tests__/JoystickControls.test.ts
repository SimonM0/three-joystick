import * as THREE from 'three';
import JoystickControls from '../JoystickControls';
import { Object3D } from 'three';

// import getPositionInScene from '../helpers/getPositionInScene';

enum TOUCH {
  START = 'touchstart',
  MOVE = 'touchmove',
  END = 'touchend',
}

enum MOUSE {
  DOWN = 'mousedown',
  MOVE = 'mousemove',
  UP = 'mouseup',
}

const fireTouchEvent = (
  touchEventName: TOUCH,
  location?: { clientX: number, clientY: number },
) => {
  const touchEnd = new TouchEvent(touchEventName, {});
  touchEnd.touches.item = () => (location as Touch);
  window.dispatchEvent(touchEnd);
};

const fireMouseEvent = (
  mouseEventName: MOUSE,
  location?: { clientX: number, clientY: number },
) => {
  const mouseEvent = new MouseEvent(mouseEventName, location);

  window.dispatchEvent(mouseEvent);
};

jest.mock('../helpers/getPositionInScene', () => ({
  __esModule: true,
  default: () => new THREE.Vector2(100, 100),
}));

describe('JoystickControls', () => {
  describe('touch events', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    it('should not invoke `onStart` if the `preventAction` function returned `true`', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.preventAction = () => true;

      const spyOnStart = jest.spyOn(
        controls,
        // @ts-ignore
        'onStart',
      );

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnStart).not.toHaveBeenCalled();
    });

    it('should not invoke `onStart` if the touch is undefined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnStart = jest.spyOn(
        controls,
        // @ts-ignore
        'onStart',
      );

      fireTouchEvent(TOUCH.START);

      expect(spyOnStart).not.toHaveBeenCalled();
    });

    it('should invoke `onStart` if the touch is defined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnStart = jest.spyOn(
        controls,
        // @ts-ignore
        'onStart',
      );

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnStart).toHaveBeenCalledTimes(1);
    });

    it('should not invoke `onMove` if the `preventAction` function returned `true`', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.preventAction = () => true;

      const spyOnMove = jest.spyOn(
        controls,
        // @ts-ignore
        'onMove',
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnMove).not.toHaveBeenCalled();
    });

    it('should not invoke `onMove` if the touch is undefined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnMove = jest.spyOn(
        controls,
        // @ts-ignore
        'onMove',
      );

      fireTouchEvent(TOUCH.MOVE);

      expect(spyOnMove).not.toHaveBeenCalled();
    });

    it('should invoke `onMove` if the touch is defined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnMove = jest.spyOn(
        controls,
        // @ts-ignore
        'onMove',
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnMove).toHaveBeenCalledTimes(1);
    });

    it('should not invoke `onEnd` if the joystick is not attached', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnEnd = jest.spyOn(
        controls,
        // @ts-ignore
        'onEnd',
      );

      controls.isJoystickAttached = false;

      fireTouchEvent(TOUCH.END);

      expect(spyOnEnd).not.toHaveBeenCalled();
    });

    it('should invoke `onEnd` if the joystick is attached', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnEnd = jest.spyOn(
        controls,
        // @ts-ignore
        'onEnd',
      );

      controls.isJoystickAttached = true;

      fireTouchEvent(TOUCH.END);

      expect(spyOnEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('mouse events', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    it('should not invoke `onStart` if the `preventAction` function returned `true`', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.preventAction = () => true;

      const spyOnStart = jest.spyOn(
        controls,
        // @ts-ignore
        'onStart',
      );

      fireMouseEvent(
        MOUSE.DOWN,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnStart).not.toHaveBeenCalled();
    });

    it('should invoke `onStart` if the location is defined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnStart = jest.spyOn(
        controls,
        // @ts-ignore
        'onStart',
      );

      fireMouseEvent(
        MOUSE.DOWN,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnStart).toHaveBeenCalledTimes(1);
    });

    it('should not invoke `onMove` if the `preventAction` function returned `true`', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.preventAction = () => true;

      const spyOnMove = jest.spyOn(
        controls,
        // @ts-ignore
        'onMove',
      );

      fireMouseEvent(
        MOUSE.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnMove).not.toHaveBeenCalled();
    });

    it('should invoke `onMove` if the location is defined', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnMove = jest.spyOn(
        controls,
        // @ts-ignore
        'onMove',
      );

      fireMouseEvent(
        MOUSE.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyOnMove).toHaveBeenCalledTimes(1);
    });

    it('should not invoke `onEnd` if the joystick is not attached', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnEnd = jest.spyOn(
        controls,
        // @ts-ignore
        'onEnd',
      );

      controls.isJoystickAttached = false;

      fireMouseEvent(MOUSE.UP);

      expect(spyOnEnd).not.toHaveBeenCalled();
    });

    it('should invoke `onEnd` if the joystick is attached', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyOnEnd = jest.spyOn(
        controls,
        // @ts-ignore
        'onEnd',
      );

      controls.isJoystickAttached = true;

      fireMouseEvent(MOUSE.UP);

      expect(spyOnEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('onStart', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    it('should set the base anchor point to the clientX and clientY provided', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );

      fireMouseEvent(
        MOUSE.DOWN,
        {
          clientX: 0,
          clientY: 128,
        },
      );

      expect(controls.baseAnchorPoint).toEqual(new THREE.Vector2(0, 128));
    });

    it('should set interactionHasBegan to true', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );

      fireMouseEvent(
        MOUSE.DOWN,
        {
          clientX: 0,
          clientY: 128,
        },
      );

      expect(controls.interactionHasBegan).toEqual(true);
    });
  });

  describe('onMove', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    it('should set the touch point to the clientX `0` and clientY `128`', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 128,
        },
      );

      expect(controls.touchPoint).toEqual(new THREE.Vector2(0, 128));
    });

    it('should invoke `attachJoystick` with the positionInScene mock vector', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      // @ts-ignore
      const spyAttachJoystick = jest.spyOn(controls, 'attachJoystick');

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyAttachJoystick)
        .toHaveBeenCalledWith(new THREE.Vector2(100, 100));
    });

    it('should invoke `updateJoystickBallPosition` with the positionInScene', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const spyUpdateJoystickBallPosition = jest
        // @ts-ignore
        .spyOn(controls, 'updateJoystickBallPosition');

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 128,
        },
      );

      expect(spyUpdateJoystickBallPosition)
        .toHaveBeenCalledWith(0, 128, new THREE.Vector2(100, 100));
    });
  });

  describe('onEnd', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const spyGetObjectByName = jest.spyOn(scene, 'getObjectByName');

    it('should remove the joystick-base from the scene', () => {
      new JoystickControls(
        camera,
        scene,
      );

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.END,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyGetObjectByName).toHaveBeenCalledWith('joystick-base');
      expect(scene.getObjectByName('joystick-base')).toBeUndefined();
    });

    it('should remove the joystick-ball from the scene', () => {
      new JoystickControls(
        camera,
        scene,
      );

      fireTouchEvent(
        TOUCH.START,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.MOVE,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      fireTouchEvent(
        TOUCH.END,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(spyGetObjectByName).toHaveBeenLastCalledWith('joystick-ball');
      expect(scene.getObjectByName('joystick-ball')).toBeUndefined();
    });

    it('should set isJoystickAttached to false', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.isJoystickAttached = true;
      controls.interactionHasBegan = true;

      fireTouchEvent(
        TOUCH.END,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(controls.isJoystickAttached).toEqual(false);
    });

    it('should set interactionHasBegan to false', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      controls.isJoystickAttached = true;
      controls.interactionHasBegan = true;

      fireTouchEvent(
        TOUCH.END,
        {
          clientX: 0,
          clientY: 0,
        },
      );

      expect(controls.interactionHasBegan).toEqual(false);
    });
  });

  describe('attachJoystickUI', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    it('should set the position to the mockPosition', () => {
      const controls = new JoystickControls(
        camera,
        scene,
      );
      const mockColor = 0x111111;
      const mockSize = 100;
      const mockPosition = new THREE.Vector3(1, 2, 3);
      const mockName = 'test-ui';
      // @ts-ignore
      controls.attachJoystickUI(
        mockName,
        mockPosition,
        mockColor,
        mockSize,
      );
      // @ts-ignore
      const sceneUIObject = scene.getObjectByName(mockName) as any;

      sceneUIObject.uuid = 'stripped-for-snapshot-test';
      sceneUIObject.geometry.uuid = 'stripped-for-snapshot-test';
      sceneUIObject.material.uuid = 'stripped-for-snapshot-test';
      sceneUIObject.parent.uuid = 'stripped-for-snapshot-test';

      expect(sceneUIObject).toMatchSnapshot();
    });
  });
});
