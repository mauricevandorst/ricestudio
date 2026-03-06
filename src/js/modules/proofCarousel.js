export function initProofCarousel() {
  const root = document.querySelector("[data-proof-carousel]");
  if (!root) {
    return;
  }

  const track = root.querySelector("[data-proof-track]");
  const prevButton = root.querySelector("[data-proof-prev]");
  const nextButton = root.querySelector("[data-proof-next]");
  const slides = Array.from(root.querySelectorAll("[data-proof-slide]"));

  if (!track || slides.length < 2 || !prevButton || !nextButton) {
    return;
  }

  let index = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isTouchTracking = false;
  let hasHorizontalIntent = false;

  const setSlideStates = () => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      const rawOffset = slideIndex - index;
      const forwardWrap = rawOffset + slides.length;
      const backwardWrap = rawOffset - slides.length;
      const offset = [rawOffset, forwardWrap, backwardWrap].reduce((best, candidate) =>
        Math.abs(candidate) < Math.abs(best) ? candidate : best
      );

      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      slide.dataset.proofOffset = String(offset);
    });
  };

  const move = (direction) => {
    index = (index + direction + slides.length) % slides.length;
    setSlideStates();
  };

  prevButton.addEventListener("click", () => move(-1));
  nextButton.addEventListener("click", () => move(1));

  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) {
      return;
    }
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = performance.now();
    isTouchTracking = true;
    hasHorizontalIntent = false;
  };

  const onTouchMove = (event) => {
    if (!isTouchTracking) {
      return;
    }
    const touch = event.touches?.[0];
    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (!hasHorizontalIntent) {
      if (Math.abs(deltaX) < 6) {
        return;
      }
      hasHorizontalIntent = Math.abs(deltaX) > Math.abs(deltaY);
    }

    if (hasHorizontalIntent) {
      event.preventDefault();
    }
  };

  const onTouchEnd = (event) => {
    if (!isTouchTracking) {
      return;
    }
    const changedTouch = event.changedTouches?.[0];
    isTouchTracking = false;

    if (!changedTouch) {
      return;
    }

    const deltaX = changedTouch.clientX - touchStartX;
    const deltaY = changedTouch.clientY - touchStartY;
    const elapsed = Math.max(performance.now() - touchStartTime, 1);
    const velocityX = Math.abs(deltaX / elapsed);
    const hasDistanceSwipe = Math.abs(deltaX) > 52 && Math.abs(deltaX) > Math.abs(deltaY);
    const hasVelocitySwipe = velocityX > 0.32 && Math.abs(deltaX) > 18 && Math.abs(deltaX) > Math.abs(deltaY);

    if (hasDistanceSwipe || hasVelocitySwipe) {
      move(deltaX < 0 ? 1 : -1);
    }
  };

  root.addEventListener("touchstart", onTouchStart, { passive: true });
  root.addEventListener("touchmove", onTouchMove, { passive: false });
  root.addEventListener("touchend", onTouchEnd, { passive: true });
  root.addEventListener("touchcancel", () => {
    isTouchTracking = false;
  });
  setSlideStates();
}
