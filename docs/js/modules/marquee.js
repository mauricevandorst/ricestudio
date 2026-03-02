export function initMarquee() {
  const marquee = document.querySelector(".marquee");
  if (!marquee) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    marquee.classList.add("is-reduced-motion");
    return;
  }

  marquee.classList.add("is-ready");
}
