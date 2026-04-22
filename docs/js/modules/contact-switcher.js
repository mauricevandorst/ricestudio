const USE_FAKE_CONTACT_SUBMIT = false;
const DUTCH_FORM_FIELD_NAMES = {
  name: "Naam",
  phone: "Telefoonnummer",
  company: "Bedrijfsnaam",
  email: "E-mailadres",
  message: "Bericht",
};

function localizeFormDataFieldNames(formData) {
  Object.entries(DUTCH_FORM_FIELD_NAMES).forEach(([originalName, dutchName]) => {
    if (!formData.has(originalName)) {
      return;
    }

    const values = formData.getAll(originalName);
    formData.delete(originalName);

    values.forEach((value) => {
      formData.append(dutchName, value);
    });
  });
}

function fillEmptyFormDataValues(formData) {
  for (const [name, value] of Array.from(formData.entries())) {
    if (typeof value === "string" && value.trim() === "") {
      formData.set(name, "(leeg)");
    }
  }
}

export function initContactSwitcher() {
  const root = document.querySelector("[data-contact-switcher]");

  if (!root) {
    return;
  }

  const tabs = [...root.querySelectorAll("[data-contact-tab]")];
  const panels = [...root.querySelectorAll("[data-contact-panel]")];
  const messageForm = root.querySelector('form[action="https://api.web3forms.com/submit"]');
  const feedbackModal = root.querySelector("[data-contact-feedback]");
  const feedbackDialog = root.querySelector("[data-contact-feedback-dialog]");
  const feedbackTitle = root.querySelector("#contact-feedback-title");
  const feedbackMessage = root.querySelector("[data-contact-feedback-message]");
  const feedbackCloseButtons = [
    ...root.querySelectorAll("[data-contact-feedback-close], [data-contact-feedback-confirm]"),
  ];

  if (!tabs.length || !panels.length) {
    return;
  }

  let lastFocusedElement = null;

  const closeFeedbackModal = () => {
    if (!(feedbackModal instanceof HTMLElement) || !(feedbackDialog instanceof HTMLElement)) {
      return;
    }

    feedbackModal.classList.add("pointer-events-none", "opacity-0");
    feedbackModal.classList.remove("flex");
    feedbackModal.classList.add("hidden");
    feedbackDialog.classList.add("translate-y-6");
    feedbackModal.setAttribute("aria-hidden", "true");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  };

  const openFeedbackModal = ({ title, message }) => {
    if (!(feedbackModal instanceof HTMLElement) || !(feedbackDialog instanceof HTMLElement)) {
      return;
    }

    if (feedbackTitle instanceof HTMLElement) {
      feedbackTitle.textContent = title;
    }

    if (feedbackMessage instanceof HTMLElement) {
      feedbackMessage.textContent = message;
    }

    lastFocusedElement = document.activeElement;
    feedbackModal.classList.remove("hidden", "pointer-events-none", "opacity-0");
    feedbackModal.classList.add("flex");
    feedbackDialog.classList.remove("translate-y-6");
    feedbackModal.setAttribute("aria-hidden", "false");

    const closeTarget = feedbackCloseButtons[0];

    if (closeTarget instanceof HTMLElement) {
      window.setTimeout(() => {
        closeTarget.focus();
      }, 0);
    }
  };

  feedbackCloseButtons.forEach((button) => {
    button.addEventListener("click", closeFeedbackModal);
  });

  if (feedbackModal instanceof HTMLElement) {
    feedbackModal.addEventListener("click", (event) => {
      if (event.target === feedbackModal) {
        closeFeedbackModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (feedbackModal instanceof HTMLElement && feedbackModal.getAttribute("aria-hidden") === "false") {
      closeFeedbackModal();
    }
  });

  if (messageForm) {
    const submitButton = messageForm.querySelector('button[type="submit"]');

    messageForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!(messageForm instanceof HTMLFormElement)) {
        return;
      }

      const formData = new FormData(messageForm);
      const replyToValue = formData.get("email");

      if (typeof replyToValue === "string" && replyToValue.trim() !== "") {
        formData.set("replyto", replyToValue.trim());
      }

  localizeFormDataFieldNames(formData);
      fillEmptyFormDataValues(formData);
      const action = messageForm.getAttribute("action");
      const method = messageForm.getAttribute("method") ?? "POST";

      if (USE_FAKE_CONTACT_SUBMIT) {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = true;
          submitButton.setAttribute("aria-busy", "true");
        }

        try {
          await new Promise((resolve) => {
            window.setTimeout(resolve, 500);
          });

          messageForm.reset();
          openFeedbackModal({
            title: "Er is geen bericht verstuurd",
            message: "De test-modus is ingeschakeld. Dit betekent dat het formulier niet is ingediend en er is geen e-mail verstuurd.",
          });
        } finally {
          if (submitButton instanceof HTMLButtonElement) {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
          }
        }

        return;
      }

      if (!action) {
        openFeedbackModal({
          title: "Verzenden niet mogelijk",
          message: "Het formulier kon niet worden verzonden. Probeer het later opnieuw.",
        });
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
      }

      try {
        const response = await fetch(action, {
          method,
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          messageForm.reset();
          openFeedbackModal({
            title: "Bedankt voor je bericht!",
            message: "Je bericht is verstuurd. We nemen snel contact met je op, vrijwel altijd binnen 1 werkdag.",
          });
          return;
        }

        const errorMessage = typeof result.message === "string" && result.message
          ? result.message
          : "Het versturen van je bericht is niet gelukt. Probeer het opnieuw.";

        openFeedbackModal({
          title: "Verzenden mislukt",
          message: errorMessage,
        });
      } catch {
        openFeedbackModal({
          title: "Netwerkfout",
          message: "Er ging iets mis bij het versturen. Controleer je verbinding en probeer opnieuw.",
        });
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
          submitButton.removeAttribute("aria-busy");
        }
      }
    });
  }

  const activateTab = (tabName) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.contactTab === tabName;

      tab.setAttribute("aria-selected", String(isActive));
      tab.setAttribute("tabindex", isActive ? "0" : "-1");
      tab.classList.toggle("text-slate-950", isActive);
      tab.classList.toggle("text-slate-400", !isActive);
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.contactPanel === tabName;

      panel.classList.toggle("hidden", !isActive);
      panel.classList.toggle("block", isActive);
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.contactTab);
    });

    tab.addEventListener("keydown", (event) => {
      const currentIndex = tabs.indexOf(tab);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex].dataset.contactTab);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        tabs[previousIndex].focus();
        activateTab(tabs[previousIndex].dataset.contactTab);
      }

      if (event.key === "Home") {
        event.preventDefault();
        tabs[0].focus();
        activateTab(tabs[0].dataset.contactTab);
      }

      if (event.key === "End") {
        event.preventDefault();
        const lastIndex = tabs.length - 1;
        tabs[lastIndex].focus();
        activateTab(tabs[lastIndex].dataset.contactTab);
      }
    });

    if (index === 0 && !tab.hasAttribute("data-contact-default")) {
      tab.setAttribute("data-contact-default", "");
    }
  });

  const defaultTab = tabs.find((tab) => tab.hasAttribute("data-contact-default")) ?? tabs[0];
  activateTab(defaultTab.dataset.contactTab);

  document.querySelectorAll("[data-contact-open]").forEach((link) => {
    link.addEventListener("click", () => {
      const tabName = link.dataset.contactOpen;

      if (tabName) {
        activateTab(tabName);
      }
    });
  });
}