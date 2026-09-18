import * as THREE from '/vendor/three.module.js';

const START = new THREE.Vector3(0, 0.45, 8);

export function createTrolleyScene(canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 11, 19);
  camera.lookAt(-1, 0, -1);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height, false);
  renderer.shadowMap.enabled = true;

  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();

  scene.add(new THREE.HemisphereLight(0xffffff, 0x777777, 2.3));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(5, 12, 8);
  sun.castShadow = true;
  scene.add(sun);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: 0xf7f7f7, roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  addTrack(scene, [new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, -10)]);
  addTrack(scene, [new THREE.Vector3(0, 0, 1), new THREE.Vector3(-0.8, 0, -2), new THREE.Vector3(-5, 0, -9)]);

  addPeople(scene, [
    { x: -0.35, z: -5.2 },
    { x: 0.35, z: -5.2 },
    { x: -0.35, z: -6 },
    { x: 0.35, z: -6 },
    { x: 0, z: -6.8 },
  ], 0xe53935);
  addPeople(scene, [{ x: -4, z: -6.2 }], 0x19a463);

  const trolley = createTrain();
  trolley.position.copy(START);
  scene.add(trolley);

  const switchRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 2.3),
    new THREE.MeshStandardMaterial({ color: 0xffb02e, metalness: 0.5, roughness: 0.4 }),
  );
  switchRail.position.set(-0.22, 0.14, -0.1);
  scene.add(switchRail);

  function render() {
    renderer.render(scene, camera);
  }

  function reset() {
    trolley.position.copy(START);
    trolley.rotation.y = 0;
    switchRail.rotation.y = 0;
    render();
  }

  return { trolley, switchRail, render, reset };
}

function addTrack(scene, points) {
  const curve = new THREE.CatmullRomCurve3(points);
  for (const offset of [-0.55, 0.55]) {
    const railPoints = curve.getPoints(60).map((point) => point.clone().add(new THREE.Vector3(offset, 0.08, 0)));
    const geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPoints), 60, 0.07, 6, false);
    scene.add(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.75, roughness: 0.4 })));
  }
}

function addPeople(group, people, shirtColor) {
  for (const { x, z } of people) {
    const person = new THREE.Group();
    const shirt = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 0.72, 5, 10),
      new THREE.MeshBasicMaterial({ color: shirtColor }),
    );
    shirt.position.y = 0.9;
    shirt.castShadow = true;
    person.add(shirt);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xffc49e }),
    );
    head.position.y = 1.7;
    head.castShadow = true;
    person.add(head);

    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.55, 0.19),
        new THREE.MeshBasicMaterial({ color: 0x111111 }),
      );
      leg.position.set(side * 0.14, 0.28, 0);
      leg.castShadow = true;
      person.add(leg);
    }

    person.position.set(x, 0, z);
    group.add(person);
  }
}

function createTrain() {
  const train = new THREE.Group();
  const blue = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.45 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x20252b, roughness: 0.5 });

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.35, 3.2),
    dark,
  );
  base.position.y = 0.18;
  base.castShadow = true;
  train.add(base);

  const boiler = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.58, 1.9, 20),
    blue,
  );
  boiler.rotation.x = Math.PI / 2;
  boiler.position.set(0, 0.82, -0.45);
  boiler.castShadow = true;
  train.add(boiler);

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 1.1), blue);
  cabin.position.set(0, 0.9, 1);
  cabin.castShadow = true;
  train.add(cabin);

  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.18, 1.35), dark);
  roof.position.set(0, 1.62, 1);
  train.add(roof);

  const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.17, 0.75, 16), dark);
  chimney.position.set(0, 1.48, -1);
  chimney.castShadow = true;
  train.add(chimney);

  for (const x of [-0.92, 0.92]) {
    for (const z of [-1.05, 0, 1.05]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.18, 16), dark);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, -0.08, z);
      wheel.castShadow = true;
      train.add(wheel);
    }
  }

  return train;
}
