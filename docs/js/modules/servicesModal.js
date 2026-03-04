export function initServicesModal() {
  const body = document.body;
  const modal = document.getElementById("services-modal");
  const modalClose = document.getElementById("services-modal-close");
  const modalLabel = document.getElementById("services-modal-label");
  const modalTitle = document.getElementById("services-modal-title");
  const modalFocus = document.getElementById("services-modal-focus");
  const modalGoal = document.getElementById("services-modal-goal");
  const modalList = document.getElementById("services-modal-list");

  if (!modal) {
    return;
  }

  let lastFocusedElement = null;
  const lockBody = (lock) => body.classList.toggle("overflow-hidden", lock);

  const open = (button) => {
    if (!button) {
      return;
    }

    const { serviceLabel, serviceTitle, serviceFocus, serviceGoal, serviceItems } = button.dataset;

    if (modalLabel) modalLabel.textContent = serviceLabel || "Dienst";
    if (modalTitle) modalTitle.textContent = serviceTitle || "Onze dienst";
    if (modalFocus) modalFocus.textContent = serviceFocus || "";
    if (modalGoal) modalGoal.textContent = serviceGoal || "";
    if (modalList) {
      modalList.innerHTML = "";
      (serviceItems || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((item) => {
          const listItem = document.createElement("li");
          listItem.className = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700";
          listItem.textContent = item;
          modalList.appendChild(listItem);
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
