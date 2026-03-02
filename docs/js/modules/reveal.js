export function initRevealAnimations() {
  if (typeof IntersectionObserver === "undefined") {
    return;
  }

  const revealNodes = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.classList.remove("opacity-0", "translate-y-6");
        entry.target.classList.add("opacity-100", "translate-y-0");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
}
