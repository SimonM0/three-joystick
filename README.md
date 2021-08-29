# three-joystick
An open source joystick that can be used to control a target in a three.js scene.

# Installation
`npm i three-joystick`

# JoystickControls Usage
This class will add a joystick that invokes a callback function with the delta x and delta y from the movement of the user.  
[See demo here](https://fried-chicken.github.io/three-joystick/examples/BasicExample/index.html)  
[See example code here](https://github.com/Fried-Chicken/three-joystick/blob/master/examples/BasicExample/scene.ts)

1.  Import the JoystickControls class
    ```
    import { JoystickControls } from 'three-joystick';
    ```
2.  Pass through your camera and scene
    ```
    const joystickControls = new JoystickControls(
      camera,
      scene,
    );
    ```
3.  Invoke update in your animate loop
    ```
    function animate() {
      requestAnimationFrame(animate);

      /**
       * Updates a callback function with the delta x and delta y of the users
       * movement
       */
      joystickControls.update((movement) => {
        if (movement) {
          /**
           * The values reported back might be too large for your scene.
           * In that case you will need to control the sensitivity.
           */
          const sensitivity = 0.0001;
    
          /**
           * Do something with the values, for example changing the position
           * of the object
           */
          this.target.position.x += movement.moveX * sensitivity;
          this.target.position.y += movement.moveY * sensitivity;
        }
      });

      renderer.render(scene, camera);
    }

    animate();
    ```


# RotationJoystickControls Usage
This class will add a joystick that can rotate a target object.  
[See demo here](https://fried-chicken.github.io/three-joystick/examples/RotatingTargetExample/index.html)  
[See example code here](https://github.com/Fried-Chicken/three-joystick/blob/master/examples/RotatingTargetExample/scene.ts)

1.  Import the RotationJoystickControls class
    ```
    import { RotationJoystickControls } from 'three-joystick';
    ```
2.  Pass through your camera, scene and the target mesh you want to control
    ```
    const joystickControls = new RotationJoystickControls(
      camera,
      scene,
      target,
    );
    ```
3.  Invoke update in your animate loop
    ```
    function animate() {
      requestAnimationFrame(animate);

      /**
       * Updates the rotation of the target mesh
       */
      rotationJoystick.update();

      renderer.render(scene, camera);
    }

    animate();
    ```
