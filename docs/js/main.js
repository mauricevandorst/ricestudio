import { initBrandCarousel } from "./modules/brand-carousel.js";
import { initMarquee } from "./modules/marquee.js";
import { initYear } from "./modules/year.js";

function initHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");

  if (!(heroVideo instanceof HTMLVideoElement)) {
    return;
  }

  const setPlaybackRate = () => {
    heroVideo.playbackRate = 3;
    heroVideo.defaultPlaybackRate = 3;
  };

  setPlaybackRate();
  heroVideo.addEventListener("loadedmetadata", setPlaybackRate);
}

function initViewportMetrics() {
  const header = document.querySelector("[data-site-header]");
  const root = document.documentElement;

  const updateMetrics = () => {
    if (header) {
      root.style.setProperty("--header-height", `${header.offsetHeight}px`);
    }
  };

  updateMetrics();

  if (header && "ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(header);
  }

  window.addEventListener("resize", updateMetrics, { passive: true });
  window.visualViewport?.addEventListener("resize", updateMetrics, { passive: true });
}

function initMobileMenu() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (!menuButton || !mobileMenu) {
    return;
  }

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden", isOpen);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
}

function initRevealAnimations() {
  const revealItems = [...document.querySelectorAll("[data-reveal]")];

  if (!revealItems.length) {
    return;
  }

  const supportsObserver = "IntersectionObserver" in window;

  revealItems.forEach((item, index) => {
    item.classList.add("transform-gpu", "transition-all", "duration-700", "ease-out");
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;

    if (supportsObserver) {
      item.classList.add("translate-y-6", "opacity-0");
    }
  });

  if (!supportsObserver) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.remove("translate-y-6", "opacity-0");
        entry.target.classList.add("translate-y-0", "opacity-100");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initFaq() {
  const faqButtons = [...document.querySelectorAll("[data-faq-button]")];

  if (!faqButtons.length) {
    return;
  }

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest("article");
      const panel = item?.querySelector("[data-faq-panel]");
      const icon = item?.querySelector("[data-faq-icon]");
      const isOpen = panel && !panel.classList.contains("hidden");

      faqButtons.forEach((otherButton) => {
        const otherItem = otherButton.closest("article");
        const otherPanel = otherItem?.querySelector("[data-faq-panel]");
        const otherIcon = otherItem?.querySelector("[data-faq-icon]");

        otherPanel?.classList.add("hidden");
        if (otherIcon) {
          otherIcon.textContent = "+";
        }
      });

      if (!panel) {
        return;
      }

      panel.classList.toggle("hidden", isOpen);
      if (icon) {
        icon.textContent = isOpen ? "+" : "−";
      }
    });
  });
}

function initHeaderState() {
  const header = document.querySelector("[data-site-header]");
  const headerShell = document.querySelector("[data-header-shell]");
  const headerTextTargets = [...document.querySelectorAll("[data-header-text]")];

  if (!header || !headerShell) {
    return;
  }

  let isCompact = false;
  let frameId = 0;

  const applyState = (compact) => {
    isCompact = compact;

    headerShell.classList.toggle("py-0", compact);
    headerShell.classList.toggle("py-3", !compact);
    headerShell.classList.toggle("bg-white", compact);
    headerShell.classList.toggle("shadow-lg", compact);
    headerShell.classList.toggle("shadow-slate-900/10", compact);

    headerTextTargets.forEach((target) => {
      target.classList.toggle("text-black/80", compact);
      target.classList.toggle("text-[#bba0f9]", !compact);
    });
  };

  const updateHeader = () => {
    const shouldBeCompact = window.scrollY > 8;

    if (shouldBeCompact === isCompact) {
      return;
    }

    applyState(shouldBeCompact);
  };

  applyState(window.scrollY > 8);
  window.addEventListener(
    "scroll",
    () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateHeader();
      });
    },
    { passive: true },
  );
}

initYear();
initViewportMetrics();
initMobileMenu();
initRevealAnimations();
initFaq();
initHeaderState();
initHeroVideo();
initMarquee();
initBrandCarousel();