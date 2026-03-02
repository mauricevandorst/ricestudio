const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), textarea, input, select";

export function initMobileMenu() {
  const body = document.body;
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-overlay");

  let lastFocusedElement = null;

  const lockBody = (lock) => body.classList.toggle("overflow-hidden", lock);
  const isOpen = () => Boolean(mobileMenu && !mobileMenu.classList.contains("hidden"));

  const open = () => {
    if (!mobileMenu || !mobileOverlay || !menuToggle) {
      return;
    }
    lastFocusedElement = document.activeElement;
    mobileMenu.classList.remove("hidden", "translate-x-full");
    mobileOverlay.classList.remove("hidden", "pointer-events-none");
    requestAnimationFrame(() => {
      mobileMenu.classList.add("translate-x-0");
      mobileOverlay.classList.add("opacity-100");
    });
    menuToggle.setAttribute("aria-expanded", "true");
    lockBody(true);
    const focusable = mobileMenu.querySelectorAll(FOCUSABLE_SELECTOR);
    if (focusable.length) {
      focusable[0].focus();
    }
  };

  const close = () => {
    if (!mobileMenu || !mobileOverlay || !menuToggle) {
      return;
    }
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("translate-x-full");
    mobileOverlay.classList.remove("opacity-100");
    menuToggle.setAttribute("aria-expanded", "false");
    lockBody(false);
    window.setTimeout(() => {
      mobileMenu.classList.add("hidden");
      mobileOverlay.classList.add("hidden", "pointer-events-none");
    }, 250);
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const trapFocus = (event) => {
    if (!mobileMenu || mobileMenu.classList.contains("hidden") || event.key !== "Tab") {
      return;
    }
    const focusable = Array.from(mobileMenu.querySelectorAll(FOCUSABLE_SELECTOR));
    if (!focusable.length) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", open);
  }
  if (menuClose) {
    menuClose.addEventListener("click", close);
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", close);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
    trapFocus(event);
  });

  return { open, close, isOpen };
}
