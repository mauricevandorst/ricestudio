
import { initBackToTop } from "./modules/backToTop.js";
import { initContactForm } from "./modules/contactForm.js";
import { initFaqAccordion } from "./modules/faq.js";
import { initMobileMenu } from "./modules/mobileMenu.js";
import { initNavObserver } from "./modules/navObserver.js";
import { initPortfolioModal } from "./modules/portfolioModal.js";
import { initRevealAnimations } from "./modules/reveal.js";
import { initSmoothScroll } from "./modules/smoothScroll.js";
import { initTypingAnimation } from "./modules/typingAnimation.js";
import { initWebsiteSimulator } from "./modules/websiteSimulator.js";
import { initYear } from "./modules/year.js";
import { initMarquee } from "./modules/marquee.js";

// Bestand: js/main.js | Doel: Init van losse UI-modules.
initYear();
initTypingAnimation();
const mobileMenu = initMobileMenu();
initPortfolioModal();
initSmoothScroll({
  closeMobileMenu: mobileMenu.close,
  isMobileMenuOpen: mobileMenu.isOpen,
});
initFaqAccordion();
initNavObserver();
initRevealAnimations();
initWebsiteSimulator();
initMarquee();
initContactForm();
initBackToTop();
