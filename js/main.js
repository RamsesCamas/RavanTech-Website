document.addEventListener('DOMContentLoaded', function() {
  // --- Código EmailJS existente ---
  emailjs.init("ou7SnfPP_QimlwoqM");
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    emailjs.sendForm('service_kzroe42', 'template_bx5xyul', this)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        document.getElementById('contact-result').innerHTML =
          '<p class="text-success">Mensaje enviado exitosamente.</p>';
        form.reset();
      }, function(error) {
        console.log('FAILED...', error);
        document.getElementById('contact-result').innerHTML =
          '<p class="text-danger">Error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>';
      });
  });
  // --- Fin de código EmailJS ---

  // --- Three.js para el modelo ---
  const container = document.getElementById('vr-model-container');
  if (container) {
    // 1. Crear escena y cámara
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // 2. Crear renderer con transparencia
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Fondo transparente
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Escena sin fondo
    scene.background = null;

    // 3. Iluminación
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    // 4. Variable para referencia al modelo
    let model = null;

    // 5. Cargar modelo GLB
    const loader = new THREE.GLTFLoader();
    loader.load(
      './3Dmodels/VR_Headset.glb',
      function(gltf) {
        model = gltf.scene;
        scene.add(model);
        animate();
      },
      function(xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
      },
      function(error) {
        console.error('Error al cargar modelo', error);
      }
    );

    // Posicionar la cámara
    camera.position.set(0, 1, 3);

    // 6. Eliminar OrbitControls para que el usuario NO rote el modelo
    // (comentamos o removemos completamente estas líneas)
    // const controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;

    // 7. Loop de animación
    function animate() {
      requestAnimationFrame(animate);

      // Rotar el modelo si ya está cargado
      if (model) {
        model.rotation.y += 0.01; // Ajusta la velocidad de giro
      }

      // Renderizar la escena
      renderer.render(scene, camera);
    }
  }
});
