export function initBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) {
    return;
  }

  const toggleBackToTop = () => {
    const show = window.scrollY > 500;
    backToTop.classList.toggle("hidden", !show);
    backToTop.classList.toggle("flex", show);
  };

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  window.addEventListener("load", toggleBackToTop);
}
