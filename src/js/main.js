import { initBrandCarousel } from "./modules/brand-carousel.js";
import { initMarquee } from "./modules/marquee.js";
import { initReviews } from "./modules/reviews.js";
import { initValuesCarousel } from "./modules/values-carousel.js";
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
  const headerLogo = document.querySelector("[data-header-logo]");
  const headerOutlineButtons = [...document.querySelectorAll("[data-header-outline-button]")];

  if (!header || !headerShell) {
    return;
  }

  let isCompact = false;
  let frameId = 0;

  const applyState = (compact) => {
    isCompact = compact;

    headerShell.classList.toggle("py-1", compact);
    headerShell.classList.toggle("py-3", !compact);
    headerShell.classList.toggle("lg:py-3", compact);
    headerShell.classList.toggle("lg:py-6", !compact);
    headerShell.classList.toggle("bg-white", compact);
    headerShell.classList.toggle("shadow-lg", compact);
    headerShell.classList.toggle("shadow-slate-900/10", compact);

    headerTextTargets.forEach((target) => {
      target.classList.toggle("text-black/80", compact);
      target.classList.toggle("text-[#bba0f9]", !compact);
    });

    headerOutlineButtons.forEach((button) => {
      button.style.borderWidth = compact ? "1px" : "0px";
    });

    if (headerLogo instanceof HTMLImageElement) {
      const defaultLogo = headerLogo.dataset.logoDefault;
      const compactLogo = headerLogo.dataset.logoCompact;

      headerLogo.classList.toggle("opacity-80", compact);
      headerLogo.classList.toggle("opacity-100", !compact);

      if (defaultLogo && compactLogo) {
        headerLogo.src = compact ? compactLogo : defaultLogo;
      }
    }
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

function initHeaderGlobe() {
  const globeIcons = [...document.querySelectorAll("[data-header-globe]")];

  if (!globeIcons.length) {
    return;
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const axisRadius = 8.5;
  const phases = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
  const period = 7000;
  const baseTilt = -11;
  const tiltVariance = 3;

  const globes = globeIcons
    .map((icon) => {
      const rotor = icon.querySelector("[data-header-globe-rotor]");
      const meridians = [...icon.querySelectorAll("[data-globe-meridian]")];

      if (!rotor || meridians.length !== phases.length) {
        return null;
      }

      return { meridians, rotor };
    })
    .filter(Boolean);

  if (!globes.length) {
    return;
  }

  let frameId = 0;

  const updateMeridian = (meridian, angle) => {
    const depth = Math.cos(angle);
    const radiusX = Math.max(Math.abs(depth) * axisRadius, 0.9);
    const strokeOpacity = depth >= 0 ? 0.28 + Math.abs(depth) * 0.6 : 0.12 + Math.abs(depth) * 0.18;
    const strokeWidth = depth >= 0 ? 1.15 : 0.9;

    meridian.setAttribute("rx", radiusX.toFixed(2));
    meridian.setAttribute("opacity", strokeOpacity.toFixed(2));
    meridian.setAttribute("stroke-width", strokeWidth.toFixed(2));
  };

  const render = (timestamp) => {
    const rotation = ((timestamp % period) / period) * Math.PI * 2;
    const iconTilt = baseTilt + Math.sin(rotation * 0.8) * tiltVariance;

    globes.forEach((globe) => {
      globe.rotor.setAttribute("transform", `rotate(${iconTilt.toFixed(2)} 12 12)`);

      globe.meridians.forEach((meridian, index) => {
        updateMeridian(meridian, rotation + phases[index]);
      });
    });

    frameId = window.requestAnimationFrame(render);
  };

  const stop = () => {
    if (!frameId) {
      return;
    }

    window.cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const start = () => {
    if (frameId || reducedMotionQuery.matches || document.hidden) {
      return;
    }

    frameId = window.requestAnimationFrame(render);
  };

  const applyStaticState = () => {
    globes.forEach((globe) => {
      globe.rotor.setAttribute("transform", `rotate(${baseTilt} 12 12)`);

      globe.meridians.forEach((meridian, index) => {
        updateMeridian(meridian, phases[index]);
      });
    });
  };

  const syncAnimationState = () => {
    stop();

    if (reducedMotionQuery.matches || document.hidden) {
      applyStaticState();
      return;
    }

    start();
  };

  applyStaticState();
  syncAnimationState();

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", syncAnimationState);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(syncAnimationState);
  }

  document.addEventListener("visibilitychange", syncAnimationState);
}

function initHeaderBadgeAnimation() {
  const badge = document.querySelector("[data-header-badge]");
  const brand = document.querySelector("[data-header-brand]");
  const logoShell = document.querySelector("[data-header-logo-shell]");

  if (
    !(badge instanceof HTMLElement)
    || !(brand instanceof HTMLElement)
    || !(logoShell instanceof HTMLElement)
    || typeof badge.animate !== "function"
  ) {
    return;
  }

  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const visibleDelay = 4600;
  const hiddenDelay = 1800;
  const sinkDuration = 780;
  const riseDuration = 980;
  const logoSinkDelay = 450;
  const badgeVisibleState = {
    opacity: "1",
    transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)",
    transformOrigin: "50% 100%",
  };
  const badgeHiddenState = {
    opacity: "0",
    transform: "translate3d(0, 118%, 0) scale3d(0.88, 0.3, 1)",
    transformOrigin: "50% 100%",
  };
  let timeoutId = 0;
  let logoTimeoutId = 0;
  let sinkAnimation = null;
  let riseAnimation = null;
  let lastWindowWidth = window.innerWidth;
  let lastViewportWidth = Math.round(window.visualViewport?.width ?? window.innerWidth);

  const updateLogoOffset = (centerLogo) => {
    const brandWidth = brand.getBoundingClientRect().width;
    const brandHeight = brand.getBoundingClientRect().height;
    const logoWidth = logoShell.getBoundingClientRect().width;
    const logoHeight = logoShell.getBoundingClientRect().height;
    const centerOffset = Math.max((brandWidth - logoWidth) / 2, 0);
    const middleOffset = Math.max((brandHeight - logoHeight) / 2, 0);

    logoShell.style.transform = centerLogo
      ? `translate3d(${centerOffset.toFixed(2)}px, ${middleOffset.toFixed(2)}px, 0)`
      : "translate3d(0, 0, 0)";
  };

  const clearTimers = () => {
    if (!timeoutId) {
      if (logoTimeoutId) {
        window.clearTimeout(logoTimeoutId);
        logoTimeoutId = 0;
      }

      return;
    }

    window.clearTimeout(timeoutId);
    timeoutId = 0;

    if (logoTimeoutId) {
      window.clearTimeout(logoTimeoutId);
      logoTimeoutId = 0;
    }
  };

  const stopAnimations = () => {
    sinkAnimation?.cancel();
    riseAnimation?.cancel();
    sinkAnimation = null;
    riseAnimation = null;
  };

  const applyBadgeState = (state) => {
    badge.style.opacity = state.opacity;
    badge.style.transform = state.transform;
    badge.style.webkitTransform = state.transform;
    badge.style.transformOrigin = state.transformOrigin;
    badge.style.backfaceVisibility = "hidden";
    badge.style.webkitBackfaceVisibility = "hidden";
    badge.style.willChange = "transform, opacity";
  };

  const resetBadge = () => {
    applyBadgeState(badgeVisibleState);
    updateLogoOffset(false);
  };

  const scheduleRise = () => {
    timeoutId = window.setTimeout(() => {
      if (document.hidden || reducedMotionQuery.matches) {
        resetBadge();
        return;
      }

      updateLogoOffset(false);
      applyBadgeState(badgeHiddenState);

      riseAnimation = badge.animate(
        [
          { transform: "translate3d(0, 122%, 0) scale3d(0.9, 0.35, 1)", opacity: 0 },
          { transform: "translate3d(0, -18%, 0) scale3d(1.04, 1.1, 1)", opacity: 1, offset: 0.58 },
          { transform: "translate3d(0, 6%, 0) scale3d(0.98, 0.96, 1)", opacity: 1, offset: 0.8 },
          { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
        ],
        {
          duration: riseDuration,
          easing: "cubic-bezier(0.2, 0.9, 0.2, 1)",
        },
      );

      riseAnimation.addEventListener(
        "finish",
        () => {
          applyBadgeState(badgeVisibleState);
          riseAnimation = null;
          scheduleSink();
        },
        { once: true },
      );
    }, hiddenDelay);
  };

  const scheduleSink = () => {
    timeoutId = window.setTimeout(() => {
      if (document.hidden || reducedMotionQuery.matches) {
        resetBadge();
        return;
      }

      logoTimeoutId = window.setTimeout(() => {
        updateLogoOffset(true);
        logoTimeoutId = 0;
      }, logoSinkDelay);

      applyBadgeState(badgeVisibleState);

      sinkAnimation = badge.animate(
        [
          { transform: "translate3d(0, 0, 0) scale3d(1, 1, 1)", opacity: 1 },
          { transform: "translate3d(0, -12%, 0) scale3d(1.03, 1.02, 1)", opacity: 1, offset: 0.22 },
          { transform: "translate3d(0, 24%, 0) scale3d(0.98, 1.04, 1)", opacity: 1, offset: 0.58 },
          { transform: "translate3d(0, 118%, 0) scale3d(0.88, 0.3, 1)", opacity: 0 },
        ],
        {
          duration: sinkDuration,
          easing: "cubic-bezier(0.55, 0, 0.75, 0.15)",
        },
      );

      sinkAnimation.addEventListener(
        "finish",
        () => {
          applyBadgeState(badgeHiddenState);
          sinkAnimation = null;
          scheduleRise();
        },
        { once: true },
      );
    }, visibleDelay);
  };

  const syncAnimationState = () => {
    clearTimers();
    stopAnimations();
    resetBadge();

    if (document.hidden || reducedMotionQuery.matches) {
      return;
    }

    scheduleSink();
  };

  const syncResizeWidths = () => {
    lastWindowWidth = window.innerWidth;
    lastViewportWidth = Math.round(window.visualViewport?.width ?? window.innerWidth);
  };

  const handleResponsiveResize = () => {
    const nextWindowWidth = window.innerWidth;
    const nextViewportWidth = Math.round(window.visualViewport?.width ?? nextWindowWidth);

    if (nextWindowWidth === lastWindowWidth && nextViewportWidth === lastViewportWidth) {
      return;
    }

    lastWindowWidth = nextWindowWidth;
    lastViewportWidth = nextViewportWidth;
    syncAnimationState();
  };

  syncResizeWidths();
  syncAnimationState();

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", syncAnimationState);
  } else if (typeof reducedMotionQuery.addListener === "function") {
    reducedMotionQuery.addListener(syncAnimationState);
  }

  document.addEventListener("visibilitychange", syncAnimationState);
  window.addEventListener("resize", handleResponsiveResize, { passive: true });
  window.visualViewport?.addEventListener("resize", handleResponsiveResize, { passive: true });
}

function initUnderlinedHeading() {
  const heading = document.querySelector("[data-underlined-heading]");
  const anchor = document.querySelector("[data-underlined-heading-anchor]");
  const underline = document.querySelector("[data-underlined-heading-art]");

  if (!(heading instanceof HTMLElement) || !(anchor instanceof HTMLElement) || !(underline instanceof HTMLElement)) {
    return;
  }

  let frameId = 0;

  const getHeadingLineCount = () => {
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    if (!textNodes.length) {
      return 1;
    }

    const range = document.createRange();
    const firstNode = textNodes[0];
    const lastNode = textNodes.at(-1);

    if (!firstNode || !lastNode) {
      return 1;
    }

    range.setStart(firstNode, 0);
    range.setEnd(lastNode, lastNode.textContent?.length ?? 0);

    return Math.max(range.getClientRects().length, 1);
  };

  const applyUnderlineState = () => {
    const isSingleLine = getHeadingLineCount() === 1;

    underline.classList.toggle("lg:translate-x-[3.5rem]", isSingleLine);
    underline.classList.toggle("lg:-translate-x-1/2", !isSingleLine);
    underline.classList.toggle("md:translate-x-[2rem]", isSingleLine);
    underline.classList.toggle("md:-translate-x-1/2", !isSingleLine);
    anchor.classList.toggle("mx-auto", !isSingleLine);
  };

  const scheduleUpdate = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      applyUnderlineState();
    });
  };

  applyUnderlineState();

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(heading);
  }

  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, { passive: true });
  document.fonts?.ready.then(scheduleUpdate).catch(() => {});
}

initYear();
initViewportMetrics();
initMobileMenu();
initRevealAnimations();
initFaq();
initHeaderState();
initHeaderGlobe();
initHeaderBadgeAnimation();
initUnderlinedHeading();
initHeroVideo();
initMarquee();
initBrandCarousel();
initValuesCarousel();
initReviews();