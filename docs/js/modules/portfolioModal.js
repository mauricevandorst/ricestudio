export function initPortfolioModal() {
  const body = document.body;
  const modal = document.getElementById("portfolio-modal");
  const modalClose = document.getElementById("modal-close");
  const modalLabel = document.getElementById("modal-label");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalImpactList = document.getElementById("modal-impact-list");
  const modalStory = document.getElementById("modal-story");
  const OPEN_CLASS = "is-open";
  const CLOSE_DURATION_MS = 420;

  if (!modal) {
    return;
  }

  let lastFocusedElement = null;
  let closeTimer = null;
  const lockBody = (lock) => body.classList.toggle("overflow-hidden", lock);

  const open = (button) => {
    if (!button) {
      return;
    }
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    const { projectLabel, projectTitle, projectImpact, projectStory, projectImage } = button.dataset;
    if (modalLabel) modalLabel.textContent = projectLabel || "Wat wij hebben betekend";
    if (modalTitle) modalTitle.textContent = projectTitle || "Project";
    if (modalImage) {
      if (projectImage) {
        modalImage.src = projectImage;
        modalImage.alt = `Projectbeeld van ${projectTitle || "dit project"}`;
        modalImage.classList.remove("hidden");
      } else {
        modalImage.removeAttribute("src");
        modalImage.alt = "";
        modalImage.classList.add("hidden");
      }
    }
    if (modalImpactList) {
      modalImpactList.innerHTML = "";
      const impactItems = (projectImpact || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      impactItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        const itemNumber = document.createElement("span");
        const itemText = document.createElement("span");

        listItem.className = "flex items-baseline gap-3 border-b border-slate-300/70 pb-3 text-base leading-relaxed text-slate-700 last:border-b-0 last:pb-0";
        itemNumber.className = "shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600";
        itemText.className = "text-slate-700";

        itemNumber.textContent = String(index + 1).padStart(2, "0");
        itemText.textContent = item;

        listItem.append(itemNumber, itemText);
        modalImpactList.appendChild(listItem);
      });
    }
    if (modalStory) modalStory.textContent = projectStory || "";
    lastFocusedElement = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    window.requestAnimationFrame(() => {
      modal.classList.add(OPEN_CLASS);
    });
    lockBody(true);
    if (modalClose) {
      modalClose.focus();
    }
  };

  const close = () => {
    if (modal.classList.contains("hidden")) {
      return;
    }
    modal.classList.remove(OPEN_CLASS);
    lockBody(false);
    closeTimer = window.setTimeout(() => {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
      }
      closeTimer = null;
    }, CLOSE_DURATION_MS);
  };

  document.querySelectorAll("[data-project-card], [data-proof-slide]").forEach((trigger) => {
    trigger.addEventListener("click", () => open(trigger));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(trigger);
      }
    });
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
