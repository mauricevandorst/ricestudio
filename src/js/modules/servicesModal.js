export function initServicesModal() {
  const body = document.body;
  const modal = document.getElementById("services-modal");
  const modalClose = document.getElementById("services-modal-close");
  const modalLabel = document.getElementById("services-modal-label");
  const modalTitle = document.getElementById("services-modal-title");
  const modalFocus = document.getElementById("services-modal-focus");
  const modalFocus1 = document.getElementById("services-modal-focus-1");
  const modalFocus2 = document.getElementById("services-modal-focus-2");
  const modalGoal = document.getElementById("services-modal-goal");
  const modalList = document.getElementById("services-modal-list");
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

    const { serviceLabel, serviceTitle, serviceFocus, serviceFocus1, serviceFocus2, serviceGoal, serviceItems } = button.dataset;

    if (modalLabel) modalLabel.textContent = serviceLabel || "Dienst";
    if (modalTitle) modalTitle.textContent = serviceTitle || "Onze dienst";
    const primaryFocus = (serviceFocus1 || serviceFocus || "").trim();
    const secondaryFocus = (serviceFocus2 || "").trim();
    if (modalFocus) {
      modalFocus.classList.toggle("hidden", !primaryFocus && !secondaryFocus);
    }
    if (modalFocus1) {
      modalFocus1.textContent = primaryFocus;
      modalFocus1.classList.toggle("hidden", !primaryFocus);
    }
    if (modalFocus2) {
      modalFocus2.textContent = secondaryFocus;
      modalFocus2.classList.toggle("hidden", !secondaryFocus);
    }
    if (modalGoal) modalGoal.textContent = serviceGoal || "";
    if (modalList) {
      modalList.innerHTML = "";
      (serviceItems || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item, index) => {
          const listItem = document.createElement("li");
          const itemNumber = document.createElement("span");
          const itemText = document.createElement("span");

          listItem.className = "flex items-baseline gap-3 border-b border-slate-300/70 pb-3 text-base leading-relaxed text-slate-700 last:border-b-0 last:pb-0";
          itemNumber.className = "shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-blue-600";
          itemText.className = "text-slate-700";

          itemNumber.textContent = String(index + 1).padStart(2, "0");
          itemText.textContent = item;

          listItem.append(itemNumber, itemText);
          modalList.appendChild(listItem);
        });
    }

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

  document.querySelectorAll("[data-service-card]").forEach((button) => {
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
