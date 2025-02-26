document.addEventListener('DOMContentLoaded', function() {
    // Inicializa EmailJS con tu Public Key
    emailjs.init("ou7SnfPP_QimlwoqM");
  
    const form = document.getElementById('contact-form');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      // Envía el formulario; los nombres de los inputs (from_name y message) se tomarán del formulario
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
  });
  