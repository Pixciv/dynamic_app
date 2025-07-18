const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Renkli kürelerin listesi
const spheres = [];
const sphereCount = 40;

const colors = [
  0xff4081, // pembe
  0xffc107, // sarı
  0x00e676, // yeşil
  0x40c4ff, // açık mavi
  0xff5722, // turuncu
  0x9575cd, // mor
];

const geometry = new THREE.SphereGeometry(1.2, 32, 32);

for (let i = 0; i < sphereCount; i++) {
  const material = new THREE.MeshStandardMaterial({
    color: colors[i % colors.length],
    roughness: 0.4,
    metalness: 0.3,
    transparent: true,
    opacity: 0.8
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 50,
    (Math.random() - 0.5) * 60
  );

  sphere.userData = {
    speedX: (Math.random() * 0.004) + 0.001,
    speedY: (Math.random() * 0.004) + 0.001,
    directionX: Math.random() > 0.5 ? 1 : -1,
    directionY: Math.random() > 0.5 ? 1 : -1
  };

  spheres.push(sphere);
  scene.add(sphere);
}

// Işıklar
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1);
point.position.set(0, 50, 100);
scene.add(point);

camera.position.z = 70;

function animate() {
  requestAnimationFrame(animate);

  spheres.forEach(sphere => {
    const data = sphere.userData;

    sphere.position.x += data.speedX * data.directionX;
    sphere.position.y += data.speedY * data.directionY;

    if (sphere.position.x > 40 || sphere.position.x < -40) data.directionX *= -1;
    if (sphere.position.y > 25 || sphere.position.y < -25) data.directionY *= -1;

    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.003;
  });

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});