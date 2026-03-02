export function initContactForm() {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");
  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    budget: document.getElementById("budget"),
    message: document.getElementById("message"),
  };

  const setError = (fieldName, message) => {
    const field = fields[fieldName];
    const errorNode = document.getElementById(`${fieldName}-error`);
    if (!field || !errorNode) {
      return;
    }
    if (message) {
      errorNode.textContent = message;
      errorNode.classList.remove("hidden");
      field.classList.add("border-rose-500", "focus-visible:ring-rose-400");
      field.classList.remove("border-slate-300");
      field.setAttribute("aria-invalid", "true");
    } else {
      errorNode.textContent = "";
      errorNode.classList.add("hidden");
      field.classList.remove("border-rose-500", "focus-visible:ring-rose-400");
      field.classList.add("border-slate-300");
      field.removeAttribute("aria-invalid");
    }
  };

  const validateForm = () => {
    const name = fields.name?.value.trim() || "";
    const email = fields.email?.value.trim() || "";
    const phone = fields.phone?.value.trim() || "";
    const budget = fields.budget?.value || "";
    const message = fields.message?.value.trim() || "";
    let valid = true;

    if (name.length < 2) {
      setError("name", "Vul je naam in (minimaal 2 tekens).");
      valid = false;
    } else {
      setError("name", "");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Vul een geldig e-mailadres in.");
      valid = false;
    } else {
      setError("email", "");
    }
    if (phone && !/^[+()\d\s-]{8,}$/.test(phone)) {
      setError("phone", "Gebruik een geldig telefoonnummer of laat dit veld leeg.");
      valid = false;
    } else {
      setError("phone", "");
    }
    if (!budget) {
      setError("budget", "Selecteer een budgetrange.");
      valid = false;
    } else {
      setError("budget", "");
    }
    if (message.length < 15) {
      setError("message", "Beschrijf je aanvraag in minimaal 15 tekens.");
      valid = false;
    } else {
      setError("message", "");
    }

    return valid;
  };

  if (!form) {
    return;
  }

  Object.keys(fields).forEach((key) => {
    const node = fields[key];
    if (!node) {
      return;
    }
    node.addEventListener("input", () => setError(key, ""));
    node.addEventListener("change", () => setError(key, ""));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    form.reset();
    if (successMessage) {
      successMessage.classList.remove("hidden");
      window.setTimeout(() => successMessage.classList.add("hidden"), 5500);
    }
  });
}
