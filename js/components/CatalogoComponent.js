// js/components/CatalogoComponent.js

// Función que recibe un contenedor y una lista de modelos para renderizar
export function CatalogoComponent(container, modelos) {
  // Genera el HTML para cada modelo
  debugger
  const html = modelos.map(modelo => `
    <div class="modelo-card">
      <img src="${modelo.foto}" alt="${modelo.nombre}">
      <div class="info">
        <h3>${modelo.nombre}</h3>
        <p>${modelo.ciudad} · ${modelo.categoria}</p>
        <a href="modelo.html?id=${modelo._id}" class="btn">Ver perfil</a>
      </div>
    </div>
  `).join('');

  // Inserta el HTML dentro del contenedor
  container.innerHTML = `<section class="catalogo">${html}</section>`;
}
