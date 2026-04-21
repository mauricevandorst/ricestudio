export function initMobileMenu() {
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const closeButton = document.querySelector("[data-menu-close-button]");
  const openIcon = menuButton?.querySelector("[data-menu-open-icon]");
  const closeIcon = menuButton?.querySelector("[data-menu-close-icon]");

  if (!menuButton || !mobileMenu) {
    return;
  }

  let lastFocusedElement = null;

  const syncMenuState = (isOpen) => {
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Sluit menu" : "Open menu");
    mobileMenu.classList.toggle("hidden", !isOpen);
    document.documentElement.classList.toggle("overflow-hidden", isOpen);
    document.body.classList.toggle("overflow-hidden", isOpen);
    openIcon?.classList.toggle("hidden", isOpen);
    closeIcon?.classList.toggle("hidden", !isOpen);
  };

  const closeMenu = () => {
    syncMenuState(false);

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const openMenu = () => {
    lastFocusedElement = document.activeElement;
    syncMenuState(true);
    closeButton?.focus();
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  closeButton?.addEventListener("click", closeMenu);

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