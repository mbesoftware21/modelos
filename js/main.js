import { obtenerModelos } from './data.js';
import { renderListaModelos } from './render.js';
import { CatalogoComponent } from './components/CatalogoComponent.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('modelos-container');
  const modelos =await obtenerModelos()
  CatalogoComponent(container, modelos);
});
