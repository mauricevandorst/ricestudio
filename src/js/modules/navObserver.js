export function initNavObserver() {
  const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
  if (!navLinks.length || typeof IntersectionObserver === "undefined") {
    return;
  }

  const sections = ["diensten", "werk", "proces", "reviews", "faq", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("text-slate-900", active);
          link.classList.toggle("text-slate-500", !active);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => navObserver.observe(section));
}
