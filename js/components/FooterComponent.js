// js/components/FooterComponent.js

export function FooterComponent() {
  const year = new Date().getFullYear();
  return `
    <footer class="footer">
      <div class="container">
        <p>&copy; ${year} Catálogo de Modelos. Todos los derechos reservados.</p>
        <nav class="footer-nav">
          <a href="index.html">Inicio</a>
          <a href="contacto.html">Contacto</a>
        </nav>
      </div>
    </footer>
  `;
}

export function renderFooter(targetSelector = 'body') {
  const target = document.querySelector(targetSelector);
  if (target) {
    const footerHTML = FooterComponent();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = footerHTML;
    target.appendChild(wrapper);
  }
}
