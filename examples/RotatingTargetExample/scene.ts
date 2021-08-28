import './styles.scss';
import * as THREE from 'three';
import { RotationJoystickControls } from '../../src';
// import JoystickControls from '../../src';

declare global {
  interface Window { example: RotatingTargetExample; }
}

class RotatingTargetExample {
  element = document.getElementById('target');
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera();
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  rotationJoystick: RotationJoystickControls;
  earth: THREE.Mesh;
  geometry = new THREE.SphereGeometry(0.5, 36, 36);
  material = new THREE.MeshPhongMaterial({
    bumpMap: new THREE.TextureLoader().load('images/earth_bump.jpg'),
    bumpScale: 0.05,
    map: new THREE.TextureLoader().load('images/earth_map.jpg'),
    specularMap: new THREE.TextureLoader().load('images/earth_spec.jpg'),
    specular: new THREE.Color('grey')
  });
  ambientLight = new THREE.AmbientLight(0xFFFFFF);
  light = new THREE.DirectionalLight(0xFFFFFF, 0.3);

  constructor() {

    this.earth = new THREE.Mesh(this.geometry, this.material);
    this.rotationJoystick = new RotationJoystickControls(
      this.camera,
      this.scene,
      this.earth,
    );
    this.setupScene();
  }

  setupScene = () => {
    this.element?.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.light.position.x = 60;
    this.light.position.y = 60;
    this.light.position.z = 10000;

    this.scene.add(
      this.camera,
      this.earth,
      this.light,
      this.ambientLight,
    );


    this.resize();
    this.animate();
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

    this.earth.rotation.y  += 0.001;

    this.rotationJoystick.update();

    this.renderer.render(this.scene, this.camera);
  };
}

window.addEventListener('load', () => {
 window.example = new RotatingTargetExample();
});
