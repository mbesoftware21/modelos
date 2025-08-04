// js/components/HeaderComponent.js

export function HeaderComponent() {
  return `
    <header class="header">
      <div class="container">
        <h1 class="logo"><a href="index.html">Catálogo de Modelos</a></h1>
        <nav class="nav">
          <a href="index.html">Inicio</a>
          <a href="contacto.html">Contacto</a>
        </nav>
      </div>
    </header>
  `;
}

export function renderHeader(targetSelector = 'body') {
  const target = document.querySelector(targetSelector);
  if (target) {
    const headerHTML = HeaderComponent();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = headerHTML;
    target.prepend(wrapper);
  }
}
