export function renderModeloCard(modelo) {
  // Aseguramos que la ruta de la foto principal sea correcta
  const fotoPrincipal = modelo.foto.replace(/\\+/g, '/'); // Reemplaza las barras invertidas por barras normales
  debugger
  console.log(fotoPrincipal)
  return `
    <div class="card">
      <img src="${fotoPrincipal}" alt="${modelo.nombre}">
      <h3>${modelo.nombre}</h3>
      <p>${modelo.ciudad} · ${modelo.categoria}</p>
      <a href="modelo.html?id=${modelo._id}">Ver perfil</a>
    </div>
  `;
}

export function renderListaModelos(modelos, container) {
  container.innerHTML = modelos.map(renderModeloCard).join('');
}
