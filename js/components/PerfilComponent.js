export function PerfilComponent(modelo) {
  // Primero, obtenemos el HTML con las fotos y la información del modelo
  const perfilHTML = `
    <section class="perfil">
      <div class="perfil-fotos">
        <img class="perfil-foto" src="${modelo.foto}" alt="${modelo.nombre}">
        <div class="fotos-adicionales">
          ${modelo.fotos.map(foto => `<img class="foto-adicional" src="${foto}" alt="foto adicional">`).join('')}
        </div>
      </div>
      <div class="perfil-info">
        <h2>${modelo.nombre}</h2>
        <p><strong>Ciudad:</strong> ${modelo.ciudad}</p>
        <p><strong>Categoría:</strong> ${modelo.categoria}</p>
        <p><strong>Edad:</strong> ${modelo.edad || 'No disponible'} años</p>
        <p class="descripcion">${modelo.descripcion || 'Sin descripción disponible.'}</p>
        <a href="${modelo.whatsapp}" class="btn" target="_blank">Contactar vía WhatsApp</a>
      </div>
    </section>
  `;

  // Luego, agregamos el lightbox para las fotos
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  
  const lightboxImg = document.createElement('img');
  lightbox.appendChild(lightboxImg);
  document.body.appendChild(lightbox);

  // Renderizamos el perfil HTML en el contenedor correspondiente (por ejemplo, en un div con id "perfil-container")
  document.getElementById("perfil-container").innerHTML = perfilHTML;

  // Mostrar la imagen expandida cuando se hace clic
  setTimeout(() => {
    const fotos = document.querySelectorAll('.perfil-foto, .foto-adicional');
    fotos.forEach(foto => {
      foto.addEventListener('click', () => {
        lightboxImg.src = foto.src; // Establecemos la imagen del lightbox a la foto clickeada
        lightbox.classList.add('active'); // Mostramos el lightbox
      });
    });

    // Cerrar el lightbox cuando se hace clic en él
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active'); // Ocultamos el lightbox
    });
  }, 0); // Usamos setTimeout con un delay de 0 para asegurarnos de que el código se ejecute después del renderizado

  return perfilHTML;
}
