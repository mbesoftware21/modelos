import { obtenerModelos } from './data.js';
import { PerfilComponent } from './components/PerfilComponent.js';

function getModeloIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('perfil-container');
  const id = getModeloIdFromURL();

  try {
    const modelos = await obtenerModelos(); // ✅ espera la promesa
    const modelo = modelos.find(m => m._id === id); // ✅ busca por _id, ya que así está en los datos

    if (modelo) {
      container.innerHTML = PerfilComponent(modelo);
    } else {
      container.innerHTML = `<p>Modelo no encontrado.</p>`;
    }
  } catch (error) {
    console.error('Error cargando el modelo:', error);
    container.innerHTML = `<p>Error cargando los datos.</p>`;
  }
});
