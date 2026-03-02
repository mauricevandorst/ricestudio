export function initPortfolioModal() {
  const body = document.body;
  const modal = document.getElementById("portfolio-modal");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalClient = document.getElementById("modal-client");
  const modalSummary = document.getElementById("modal-summary");
  const modalResults = document.getElementById("modal-results");
  const modalTags = document.getElementById("modal-tags");

  if (!modal) {
    return;
  }

  let lastFocusedElement = null;
  const lockBody = (lock) => body.classList.toggle("overflow-hidden", lock);

  const open = (button) => {
    if (!button) {
      return;
    }
    const { projectTitle, projectClient, projectSummary, projectResults, projectTags } = button.dataset;
    if (modalTitle) modalTitle.textContent = projectTitle || "Project";
    if (modalClient) modalClient.textContent = projectClient || "";
    if (modalSummary) modalSummary.textContent = projectSummary || "";
    if (modalResults) modalResults.textContent = projectResults || "";
    if (modalTags) {
      modalTags.innerHTML = "";
      (projectTags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .forEach((tag) => {
          const chip = document.createElement("span");
          chip.className = "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700";
          chip.textContent = tag;
          modalTags.appendChild(chip);
        });
    }
    lastFocusedElement = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    lockBody(true);
    if (modalClose) {
      modalClose.focus();
    }
  };

  const close = () => {
    if (modal.classList.contains("hidden")) {
      return;
    }
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    lockBody(false);
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  document.querySelectorAll("[data-project-card]").forEach((button) => {
    button.addEventListener("click", () => open(button));
  });
  if (modalClose) {
    modalClose.addEventListener("click", close);
  }
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });

  return { open, close };
}
