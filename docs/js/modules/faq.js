export function initFaqAccordion() {
  const faqButtons = Array.from(document.querySelectorAll("[data-faq-button]"));
  if (!faqButtons.length) {
    return;
  }

  const closeAllFaq = () => {
    faqButtons.forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      const panel = document.getElementById(button.getAttribute("aria-controls") || "");
      if (panel) {
        panel.classList.add("hidden");
      }
      const marker = button.querySelector("span");
      if (marker) {
        marker.textContent = "+";
      }
    });
  };

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      closeAllFaq();
      if (!expanded) {
        button.setAttribute("aria-expanded", "true");
        const panel = document.getElementById(button.getAttribute("aria-controls") || "");
        if (panel) {
          panel.classList.remove("hidden");
        }
        const marker = button.querySelector("span");
        if (marker) {
          marker.textContent = "-";
        }
      }
    });
  });
}
