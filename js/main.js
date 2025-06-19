/* -----------------------------------------------------------
 * main.js — RavanTech
 * Ajusta modelos 3D para llenar su contenedor
 * --------------------------------------------------------- */

/**
 * Carga un modelo GLB, lo centra y lo escala para encajar
 * en el contenedor; además, coloca la cámara a la distancia
 * justa para que se vea grande sin salirse del canvas.
 *
 * @param {string} model_filepath  Ruta al .glb
 * @param {HTMLElement} container  Div donde irá el canvas
 */
function load3dModel(model_filepath, container) {
  /* 1. Escena, cámara y renderer */
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setClearColor(0x000000, 0);
  scene.background = null;
  container.appendChild(renderer.domElement);

  /* 2. Luz básica */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.3));

  /* 3. Variables */
  let model = null;

  /* 4. Carga GLB */
  const loader = new THREE.GLTFLoader();
  loader.load(
    model_filepath,

    gltf => {
      model = gltf.scene;
      scene.add(model);

      /* 4a. Centrar modelo en origen */
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);           // lleva el centro al (0,0,0)

      /* 4b. Normalizar escala para que la altura ≈ 1.7 unidades */
      const maxAxis = Math.max(size.x, size.y, size.z);
      model.scale.multiplyScalar(1.7 / maxAxis);

      /* 4c. Recalcula esfera tras escalar */
      const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
      const radius = sphere.radius;

      /* 4d. Coloca cámara al frente, un 10% más lejos del mínimo necesario */
      const fovRad = THREE.MathUtils.degToRad(camera.fov);
      const dist   = radius / Math.sin(fovRad / 2) * 1.1;
      camera.position.set(0, 0, dist);
      camera.lookAt(0, 0, 0);

      animate();
    },

    xhr   => console.log(`${((xhr.loaded / xhr.total) * 100).toFixed(1)}% cargado (${model_filepath})`),
    err   => console.error(`Error al cargar ${model_filepath}`, err)
  );

  /* 5. Render loop */
  function animate(){
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  /* 6. Resize handler */
  window.addEventListener('resize', () => {
    const { clientWidth:w, clientHeight:h } = container;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

/* ======= DOMContentLoaded ======= */
document.addEventListener('DOMContentLoaded', () => {
  /* EmailJS (sin cambios) ------------------ */
  emailjs.init("ou7SnfPP_QimlwoqM");
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    emailjs.sendForm('service_kzroe42', 'template_bx5xyul', this)
      .then(()  => {
        document.getElementById('contact-result').innerHTML =
          '<p class="text-success">Mensaje enviado exitosamente.</p>';
        form.reset();
      })
      .catch(() => {
        document.getElementById('contact-result').innerHTML =
          '<p class="text-danger">Error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>';
      });
  });

  /* 3D models ------------------------------ */
  load3dModel('./3Dmodels/VR_Headset.glb',    document.getElementById('vr-model-container'));
  load3dModel('./3Dmodels/WebsiteBrain.glb',  document.getElementById('brain-model-container'));
  load3dModel('./3Dmodels/WebsiteController.glb', document.getElementById('game-model-container'));
});
