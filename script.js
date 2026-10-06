import * as THREE from 'three';
import { GLTFLoader } from './assets/vendor/GLTFLoader.js';
import { MeshoptDecoder } from './assets/vendor/meshopt_decoder.module.js';
import { RoomEnvironment } from './assets/vendor/RoomEnvironment.js';

const modelRequest = fetch('./assets/porsche_gt3_rs.fast.glb').then(response => {
  if (!response.ok) throw new Error(`GLB HTTP ${response.status}`);
  return response.arrayBuffer();
});
modelRequest.catch(() => {});
const status = document.querySelector('.model-status');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const sections = [...document.querySelectorAll('main .section')];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 10;
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: devicePixelRatio < 2, powerPreference: 'default' });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth <= 767 ? 1 : 1.25));
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
document.querySelector('#container3D').append(renderer.domElement);
const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
const environment = pmrem.fromScene(room, 0.04);
scene.environment = environment.texture;
room.dispose();
pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xffffff, 0x555963, 2));
const key = new THREE.DirectionalLight(0xffffff, 3);
key.position.set(4, 6, 8);
scene.add(key);

const rig = new THREE.Group();
scene.add(rig);
let loaded = false;
let frame = 0;
let lastTime = 0;
const target = { x: 0, y: 0, angle: -0.65, pitch: 0.12, scale: 1 };
const views = [
  { x: 0, y: -0.30, angle: -0.65, pitch: 0.12, scale: 0.90 },
  { x: -0.27, y: -0.10, angle: 0.65, pitch: 0.07, scale: 0.84 },
  { x: 0.28, y: -0.12, angle: 2.35, pitch: 0.16, scale: 0.82 },
  { x: 0, y: -0.35, angle: 3.85, pitch: 0.10, scale: 0.62 },
];

function schedule() {
  if (!frame && loaded && !document.hidden) frame = requestAnimationFrame(render);
}
function updateTarget() {
  const anchors = sections.map(section => Math.max(0, section.getBoundingClientRect().top + scrollY - 80));
  let index = 0;
  while (index < anchors.length - 2 && scrollY >= anchors[index + 1]) index++;
  const progress = THREE.MathUtils.clamp((scrollY - anchors[index]) / Math.max(1, anchors[index + 1] - anchors[index]), 0, 1);
  const active = progress < 0.5 ? index : index + 1;
  const eased = reducedMotion.matches ? (progress < 0.5 ? 0 : 1) : progress * progress * (3 - 2 * progress);
  const from = views[index];
  const to = views[index + 1];
  const view = {};
  for (const property of ['x', 'y', 'angle', 'pitch', 'scale']) {
    view[property] = THREE.MathUtils.lerp(from[property], to[property], eased);
  }
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
  const width = height * camera.aspect;
  const mobile = innerWidth <= 767;
  target.x = mobile ? 0 : view.x * width;
  target.y = view.y * height;
  if (mobile) {
    let visibleSection = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= innerHeight / 3) visibleSection = section;
    });
    const content = visibleSection.querySelector('.des, .hero-profile');
    const contentBottom = content.getBoundingClientRect().bottom;
    const centerY = Math.max(innerHeight * 0.80, contentBottom + innerHeight * 0.16);
    target.y = (0.5 - centerY / innerHeight) * height;
  }
  target.angle = view.angle;
  target.pitch = view.pitch;
  target.scale = mobile ? Math.min(width * 0.9 / 4.6, 0.9) : Math.min(view.scale, width * 0.8 / 4.6);
  document.querySelectorAll('header nav a').forEach(link => {
    if (link.hash === '#' + sections[active].id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  schedule();
}
function render(time) {
  frame = 0;
  const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05);
  lastTime = time;
  const blend = reducedMotion.matches ? 1 : 1 - Math.exp(-dt * 7);
  rig.position.x = THREE.MathUtils.lerp(rig.position.x, target.x, blend);
  rig.position.y = THREE.MathUtils.lerp(rig.position.y, target.y, blend);
  rig.rotation.y = THREE.MathUtils.lerp(rig.rotation.y, target.angle, blend);
  rig.rotation.x = THREE.MathUtils.lerp(rig.rotation.x, target.pitch, blend);
  rig.scale.setScalar(THREE.MathUtils.lerp(rig.scale.x, target.scale, blend));
  renderer.render(scene, camera);
  const remaining = Math.abs(rig.position.x - target.x) + Math.abs(rig.position.y - target.y) + Math.abs(rig.rotation.y - target.angle) + Math.abs(rig.scale.x - target.scale) + Math.abs(rig.rotation.x - target.pitch);
  if (remaining > 0.001) schedule();
}

modelRequest.then(buffer => {
  status.textContent = 'Preparando vista 3D…';
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer, './assets/');
}).then(gltf => {
  const car = gltf.scene;
  const box = new THREE.Box3().setFromObject(car);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 4.6 / Math.max(size.x, size.y, size.z);
  car.scale.multiplyScalar(scale);
  car.position.copy(center).multiplyScalar(-scale);
  rig.add(car);
  loaded = true;
  updateTarget();
  rig.position.set(target.x, target.y, 0);
  rig.rotation.y = target.angle;
  rig.scale.setScalar(target.scale);
  rig.rotation.x = target.pitch;
  renderer.render(scene, camera);
  status.hidden = true;
  document.querySelector('#container3D').dataset.state = 'ready';
  document.querySelector('#container3D').dataset.readyMs = String(Math.round(performance.now()));
  schedule();
}).catch(error => {
  status.textContent = 'No se pudo cargar el Porsche. Recarga para volver a intentarlo.';
  console.error('Porsche GLB:', error);
});

addEventListener('scroll', updateTarget, { passive: true });
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  updateTarget();
});
reducedMotion.addEventListener('change', updateTarget);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
  else { lastTime = performance.now(); schedule(); }
});
renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  cancelAnimationFrame(frame);
  frame = 0;
  status.hidden = false;
  status.textContent = 'El navegador pausó el 3D. Recarga para recuperarlo.';
});
