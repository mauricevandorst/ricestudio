export function initRevealAnimations() {
  if (typeof IntersectionObserver === "undefined") {
    return;
  }

  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (!revealNodes.length) {
    return;
  }

  const isReloadNavigation = () => {
    const navEntries = performance.getEntriesByType?.("navigation");
    if (Array.isArray(navEntries) && navEntries.length > 0) {
      return navEntries[0].type === "reload";
    }
    // Legacy fallback for older browsers.
    return performance.navigation?.type === 1;
  };

  const startedAwayFromTop = window.scrollY > 24;
  if (startedAwayFromTop && isReloadNavigation()) {
    revealNodes.forEach((node) => {
      node.classList.add("reveal-instant");
      node.classList.remove("opacity-0", "translate-y-6");
      node.classList.add("opacity-100", "translate-y-0");
      window.requestAnimationFrame(() => {
        node.classList.remove("reveal-instant");
      });
    });
    return;
  }

  let isInitialBatch = true;

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      const instantReveal = startedAwayFromTop && isInitialBatch;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        if (instantReveal) {
          entry.target.classList.add("reveal-instant");
        }
        entry.target.classList.remove("opacity-0", "translate-y-6");
        entry.target.classList.add("opacity-100", "translate-y-0");
        if (instantReveal) {
          window.requestAnimationFrame(() => {
            entry.target.classList.remove("reveal-instant");
          });
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  const startObserving = () => {
    revealNodes.forEach((node) => revealObserver.observe(node));
    window.requestAnimationFrame(() => {
      isInitialBatch = false;
    });
  };

  const observeAfterScrollRestore = () => {
    // Wait one extra frame so browser scroll restoration is applied before IO snapshots.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(startObserving);
    });
  };

  if (document.readyState === "complete") {
    observeAfterScrollRestore();
    return;
  }

  window.addEventListener("load", observeAfterScrollRestore, { once: true });
}
