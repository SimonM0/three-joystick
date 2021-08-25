import './styles.scss';
import * as THREE from 'three';
// import TrackballControls from 'three-trackballcontrols';
import JoystickControls from '../../src';

const createExample = () => {
  const element = document.getElementById('target');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  camera.position.z = 300;

  // const controls = new TrackballControls(camera, element);

  const renderer = new THREE.WebGLRenderer();

  element?.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(50, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    wireframe: true,
    wireframeLinewidth: 10,
    color: 0xFFAACC,
  });
  const mesh = new THREE.Mesh(geometry, material);
  const joystick = new JoystickControls(camera, scene, mesh);

  const pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.x = -100;
  pointLight.position.y = 100;
  pointLight.position.z = 400;

  scene.add(camera);
  scene.add(mesh);
  scene.add(pointLight);

  const resize = () => {
    const width = element?.clientWidth || 0;
    const height = element?.clientHeight || 0;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // controls.handleResize();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    // mesh.rotation.y += 0.1 * Math.PI / 180;
    // controls.update();
    joystick.update();
    renderer.render(scene, camera);
  };

  resize();
  animate();
};

window.addEventListener('load', createExample);
