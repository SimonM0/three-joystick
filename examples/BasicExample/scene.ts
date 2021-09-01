import './styles.scss';
import * as THREE from 'three';
import { JoystickControls } from '../../src';

declare global {
  interface Window { basicExample: BasicExample; }
}

class BasicExample {
  element = document.getElementById('target');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  joystickControls: JoystickControls;
  target: THREE.Mesh;
  geometry = new THREE.SphereGeometry(1, 36, 36);
  material = new THREE.MeshPhongMaterial({
    wireframe: true,
    color: 0xFFFFFF,
  });
  light = new THREE.AmbientLight(0xFFFFFF);

  constructor() {
    this.target = new THREE.Mesh(this.geometry, this.material);
    this.joystickControls = new JoystickControls(
      this.camera,
      this.scene,
    );
    this.setupScene();
  }

  setupScene = () => {
    this.element?.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.scene.add(
      this.camera,
      this.target,
      this.light,
    );

    this.resize();
    this.animate();

    window.addEventListener('resize', this.resize);
  };

  resize = () => {
    const width = this.element?.clientWidth || 0;
    const height = this.element?.clientHeight || 0;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    this.joystickControls.update((movement) => {
      if (movement) {
        const sensitivity = 0.001;
        this.target.position.x += movement.moveX * sensitivity;
        this.target.position.y += movement.moveY * sensitivity;
      }
    });

    this.renderer.render(this.scene, this.camera);
  };
}

window.addEventListener('load', () => {
 window.basicExample = new BasicExample();
});
