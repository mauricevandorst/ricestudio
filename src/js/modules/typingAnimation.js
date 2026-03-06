export function initTypingAnimation() {
  const typingPrefixNode = document.getElementById("typing-prefix");
  const typingHighlightNode = document.getElementById("typing-highlight");
  const typingSuffixNode = document.getElementById("typing-suffix");
  const typingSuffixHighlightNode = document.getElementById("typing-suffix-highlight");
  const typingInteractiveNode = document.getElementById("typing-interactive");
  const typingPauseIndicatorNode = document.getElementById("typing-pause-indicator");
  const typingPauseIndicatorIconNode = typingPauseIndicatorNode?.querySelector("img") || null;

  if (!typingPrefixNode || !typingHighlightNode || !typingSuffixNode || !typingSuffixHighlightNode) {
    return;
  }

  const propositions = [
    { prefix: "maken ", highlight: "ads-geoptimaliseerde websites", suffix: ".", suffixHighlight: "" },
    { prefix: "bouwen ", highlight: "hand\u00ADgeschreven websites", suffix: ".", suffixHighlight: "" },
    { prefix: "maken ", highlight: "Google campagnes die klanten trekken", suffix: ".", suffixHighlight: "" },
    { prefix: "ontwikkelen ", highlight: "sites die aanvragen opleveren", suffix: ".", suffixHighlight: "" },
    { prefix: "ontwerpen ", highlight: "sites met prachtige animaties", suffix: ".", suffixHighlight: "" },
    { prefix: "bouwen jouw  ", highlight: "digitale visite\u00ADkaartje", suffix: ".", suffixHighlight: "" },
    { prefix: "zetten ", highlight: "gerichte meta ads-campagnes op", suffix: ".", suffixHighlight: "" },
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;
  let isInViewport = true;
  let isTabVisible = !document.hidden;
  let isManuallyPaused = false;
  let hasBootstrapped = false;
  let hasShownStartIndicator = false;
  let isStartIndicatorVisible = false;

  const START_INDICATOR_DURATION_MS = 900;

  const observerTarget = typingInteractiveNode || typingHighlightNode;
  const VIEWPORT_RESUME_THRESHOLD = 0.2;

  const shouldAnimate = () => isInViewport && isTabVisible && !isManuallyPaused;
  const canTypeNow = () => shouldAnimate() && !isStartIndicatorVisible;

  const showStartIndicator = () => {
    if (hasShownStartIndicator || !typingPauseIndicatorNode) {
      return false;
    }
    hasShownStartIndicator = true;
    isStartIndicatorVisible = true;
    updatePauseUi();

    window.setTimeout(() => {
      isStartIndicatorVisible = false;
      updatePauseUi();
      if (canTypeNow() && timeoutId === null) {
        scheduleTick(0);
      }
    }, START_INDICATOR_DURATION_MS);
    return true;
  };

  const bootstrapTyping = () => {
    if (hasBootstrapped) {
      return false;
    }
    hasBootstrapped = true;
    typingPrefixNode.textContent = "";
    typingHighlightNode.textContent = "";
    typingSuffixNode.textContent = "";
    typingSuffixHighlightNode.textContent = "";
    return showStartIndicator();
  };

  const updatePauseUi = () => {
    if (typingInteractiveNode) {
      typingInteractiveNode.setAttribute("aria-pressed", String(isManuallyPaused));
      typingInteractiveNode.setAttribute(
        "aria-label",
        isManuallyPaused ? "Hervat type-animatie" : "Pauzeer type-animatie"
      );
      typingInteractiveNode.setAttribute(
        "title",
        isManuallyPaused ? "Hervat type-animatie" : "Pauzeer type-animatie"
      );
    }

    if (!typingPauseIndicatorNode) {
      return;
    }
    if (typingPauseIndicatorIconNode) {
      const nextIconPath = isManuallyPaused ? "./assets/icons/pause.svg" : "./assets/icons/play.svg";
      if (typingPauseIndicatorIconNode.getAttribute("src") !== nextIconPath) {
        typingPauseIndicatorIconNode.setAttribute("src", nextIconPath);
      }
    }

    typingPauseIndicatorNode.classList.toggle(
      "typing-pause-indicator--visible",
      isManuallyPaused || isStartIndicatorVisible
    );
  };

  const pauseAnimation = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const scheduleTick = (delay) => {
    pauseAnimation();
    if (!canTypeNow()) {
      return;
    }
    timeoutId = window.setTimeout(tick, delay);
  };

  const tick = () => {
    if (!canTypeNow()) {
      pauseAnimation();
      return;
    }

    const phrase = propositions[phraseIndex];
    const suffix = phrase.suffix || "";
    const suffixHighlight = phrase.suffixHighlight || "";
    const fullText = `${phrase.prefix}${phrase.highlight}${suffix}${suffixHighlight}`;
    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    const visible = fullText.slice(0, charIndex);
    const prefixLength = phrase.prefix.length;
    const highlightLength = phrase.highlight.length;
    const suffixLength = suffix.length;
    const highlightStart = prefixLength;
    const highlightEnd = prefixLength + highlightLength;
    const suffixStart = highlightEnd;
    const suffixEnd = highlightEnd + suffixLength;

    typingPrefixNode.textContent = visible.slice(0, Math.min(prefixLength, visible.length));
    typingHighlightNode.textContent = visible.length > highlightStart
      ? visible.slice(highlightStart, Math.min(highlightEnd, visible.length))
      : "";
    typingSuffixNode.textContent = visible.length > suffixStart
      ? visible.slice(suffixStart, Math.min(suffixEnd, visible.length))
      : "";
    typingSuffixHighlightNode.textContent = visible.length > suffixEnd ? visible.slice(suffixEnd) : "";

    let delay = isDeleting ? 45 : 80;
    if (!isDeleting && charIndex === fullText.length) {
      isDeleting = true;
      delay = 1300;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % propositions.length;
      delay = 260;
    }
    scheduleTick(delay);
  };

  const onVisibilityChange = () => {
    isTabVisible = !document.hidden;
    if (shouldAnimate()) {
      if (bootstrapTyping()) {
        return;
      }
      scheduleTick(0);
      return;
    }
    pauseAnimation();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  updatePauseUi();

  const toggleManualPause = () => {
    isManuallyPaused = !isManuallyPaused;
    updatePauseUi();
    if (shouldAnimate()) {
      scheduleTick(0);
      return;
    }
    pauseAnimation();
  };

  if (typingInteractiveNode) {
    typingInteractiveNode.addEventListener("click", toggleManualPause);
    typingInteractiveNode.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      toggleManualPause();
    });
  }

  if (typeof IntersectionObserver !== "undefined") {
    const rect = observerTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
    isInViewport = visibilityRatio >= VIEWPORT_RESUME_THRESHOLD;

    const typingObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries.some(
          (entry) => entry.isIntersecting && entry.intersectionRatio >= VIEWPORT_RESUME_THRESHOLD
        );
        if (shouldAnimate()) {
          if (bootstrapTyping()) {
            return;
          }
          scheduleTick(0);
          return;
        }
        pauseAnimation();
      },
      { threshold: [0, VIEWPORT_RESUME_THRESHOLD] }
    );
    typingObserver.observe(observerTarget);
  } else {
    isInViewport = true;
  }

  if (shouldAnimate()) {
    if (bootstrapTyping()) {
      return;
    }
    scheduleTick(350);
  }
}
