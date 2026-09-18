import * as THREE from '/vendor/three.module.js';

const straightPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.45, 8),
  new THREE.Vector3(0, 0.45, 1),
  new THREE.Vector3(0, 0.45, -8),
]);

const switchedPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.45, 8),
  new THREE.Vector3(0, 0.45, 1),
  new THREE.Vector3(-0.8, 0.45, -2),
  new THREE.Vector3(-5, 0.45, -8),
]);

export function animateDecision(scene, choice) {
  scene.reset();

  if (choice === 'switch_track') {
    scene.switchRail.rotation.y = -0.42;
  }

  const path = choice === 'switch_track' ? switchedPath : straightPath;
  const startTime = performance.now();
  const duration = 2800;

  return new Promise((resolve) => {
    const timer = window.setInterval(() => {
      const now = performance.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 2;
      const point = path.getPoint(eased);
      const tangent = path.getTangent(eased);

      scene.trolley.position.copy(point);
      scene.trolley.rotation.y = Math.atan2(-tangent.x, -tangent.z);
      scene.render();

      if (progress === 1) {
        window.clearInterval(timer);
        resolve();
      }
    }, 16);
  });
}
