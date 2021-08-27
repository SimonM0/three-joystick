import './styles.scss';
import * as THREE from 'three';
import RotationJoystickControls from '../../src/RotationJoystickControls';
// import JoystickControls from '../../src';

const createExample = () => {
  const element = document.getElementById('target');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  element?.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(50, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    wireframe: true,
    wireframeLinewidth: 1,
    color: 0xFFAACC,
  });
  const actor = new THREE.Mesh(geometry, material);
  // const joystick = new JoystickControls(camera, scene);
  const rotationJoystick = new RotationJoystickControls(camera, scene, actor);

  const pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = -100;
  pointLight.position.y = 100;
  pointLight.position.z = 400;

  scene.add(camera);
  scene.add(actor);
  scene.add(pointLight);

  const resize = () => {
    const width = element?.clientWidth || 0;
    const height = element?.clientHeight || 0;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const animate = () => {
    requestAnimationFrame(animate);

    // joystick.update((movement) => {
    //   if (movement) {
    //     console.log(movement);
    //   }
    // });

    rotationJoystick.update();

    renderer.render(scene, camera);
  };

  resize();
  animate();
};

window.addEventListener('load', createExample);
