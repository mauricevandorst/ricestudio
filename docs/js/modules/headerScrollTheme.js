export function initHeaderScrollTheme({ threshold = 120 } = {}) {
  const header = document.getElementById("site-header");
  if (!header) {
    return;
  }

  const updateHeaderTheme = () => {
    const hasScrolled = window.scrollY >= threshold;
    header.classList.toggle("is-scrolled", hasScrolled);
  };

  updateHeaderTheme();
  window.addEventListener("scroll", updateHeaderTheme, { passive: true });
}
