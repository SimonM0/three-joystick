import './styles.scss';
import * as THREE from 'three';
import JoystickControls from '../../src';
import { Vector3 } from 'three';
import { Quaternion } from 'three';

const createExample = () => {
  const element = document.getElementById('target');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();

  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer();

  element?.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(50, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    wireframe: true,
    wireframeLinewidth: 1,
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
  };

  const quaternion = new Quaternion();

  const rotateAroundYAxis = (angle: number) => {
    const yAxis = new Vector3(0, 1, 0);

    quaternion.setFromAxisAngle(yAxis, angle);
    mesh.quaternion.premultiply(quaternion);
  };

  const rotateAroundXAxis = (angle: number) => {
    const xAxis = new Vector3(1, 0, 0);

    quaternion.setFromAxisAngle(xAxis, angle);
    mesh.quaternion.premultiply(quaternion);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    joystick.update((
      xRotationInRadians,
      yRotationInRadians,
    ) => {
      rotateAroundXAxis(xRotationInRadians);
      rotateAroundYAxis(yRotationInRadians);
    });

    renderer.render(scene, camera);
  };

  resize();
  animate();
};

window.addEventListener('load', createExample);
