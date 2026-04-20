export function initReviews() {
  const root = document.querySelector("[data-review-gallery]");
  const wall = root?.querySelector("[data-review-wall]");
  const triggers = root ? [...root.querySelectorAll("[data-review-trigger]")] : [];
  const card = root?.querySelector("[data-review-card]");
  const name = root?.querySelector("[data-review-name-display]");
  const role = root?.querySelector("[data-review-role-display]");
  const quote = root?.querySelector("[data-review-quote-display]");

  const formatReviewQuote = (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "";
    }

    const unwrappedValue = trimmedValue.replace(/^["“”]+|["“”]+$/g, "");

    return `“${unwrappedValue}”`;
  };

  if (!root || !wall || !triggers.length || !card || !name || !role || !quote) {
    return;
  }

  const desktopReviewHoverQuery = window.matchMedia("(min-width: 768px)");

  const getAvatarElement = (trigger) => trigger.querySelector("[data-review-avatar]") ?? trigger;

  const clearReview = () => {
    triggers.forEach((button) => {
      const avatar = getAvatarElement(button);

      button.setAttribute("aria-pressed", "false");
      avatar.classList.remove("ring-[#bba0f9]");
      avatar.classList.add("ring-slate-200");
    });

    root.style.paddingBottom = "0px";
    card.setAttribute("aria-hidden", "true");
    card.classList.add("pointer-events-none", "invisible", "opacity-0", "-translate-x-3");
    card.classList.remove("opacity-100", "translate-x-0");
  };

  const positionCard = (trigger) => {
    const rootRect = root.getBoundingClientRect();
    const wallRect = wall.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const gap = 12;

    card.style.top = "0px";
    card.style.left = "0px";

    const cardRect = card.getBoundingClientRect();

    let left = triggerRect.left - rootRect.left;
    let top = triggerRect.bottom - rootRect.top + gap;

    left = Math.max(0, Math.min(left, rootRect.width - cardRect.width));

    card.style.left = `${left}px`;
    card.style.top = `${top}px`;

    const wallBottom = wallRect.bottom - rootRect.top;
    const requiredPadding = Math.max(0, top + cardRect.height - wallBottom);
    root.style.paddingBottom = `${requiredPadding}px`;
  };

  const updateReview = (trigger) => {
    triggers.forEach((button) => {
      const isActive = button === trigger;
      const avatar = getAvatarElement(button);

      button.setAttribute("aria-pressed", String(isActive));
      avatar.classList.toggle("ring-[#bba0f9]", isActive);
      avatar.classList.toggle("ring-slate-200", !isActive);
    });

    name.textContent = trigger.dataset.reviewName ?? "";
    role.textContent = trigger.dataset.reviewRole ?? "";
    quote.textContent = formatReviewQuote(trigger.dataset.reviewQuote ?? "");

    card.setAttribute("aria-hidden", "false");
    card.classList.remove("pointer-events-none", "invisible", "opacity-0", "-translate-x-3");
    card.classList.add("opacity-100", "translate-x-0");
    positionCard(trigger);
  };

  card.classList.add("transform-gpu", "transition-all", "duration-300", "ease-out");
  root.classList.add("transition-[padding]", "duration-300", "ease-out");

  triggers.forEach((trigger) => {
    trigger.addEventListener("pointerenter", () => {
      if (!desktopReviewHoverQuery.matches) {
        return;
      }

      updateReview(trigger);
    });

    trigger.addEventListener("pointerleave", () => {
      if (!desktopReviewHoverQuery.matches) {
        return;
      }

      clearReview();
    });

    trigger.addEventListener("click", () => {
      updateReview(trigger);
    });

    trigger.addEventListener("focus", () => {
      updateReview(trigger);
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateReview(trigger);
      }
    });
  });

  root.addEventListener("focusout", (event) => {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && root.contains(nextFocusedElement)) {
      return;
    }

    clearReview();
  });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    clearReview();
  });

  window.addEventListener(
    "resize",
    () => {
      const activeTrigger = triggers.find((trigger) => trigger.getAttribute("aria-pressed") === "true");

      if (!activeTrigger) {
        return;
      }

      if (!desktopReviewHoverQuery.matches && document.activeElement !== activeTrigger) {
        clearReview();
        return;
      }

      positionCard(activeTrigger);
    },
    { passive: true },
  );

  clearReview();
}