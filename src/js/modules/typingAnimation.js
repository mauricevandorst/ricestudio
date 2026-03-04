export function initTypingAnimation() {
  const typingPrefixNode = document.getElementById("typing-prefix");
  const typingHighlightNode = document.getElementById("typing-highlight");
  const typingSuffixNode = document.getElementById("typing-suffix");
  const typingSuffixHighlightNode = document.getElementById("typing-suffix-highlight");

  if (!typingPrefixNode || !typingHighlightNode || !typingSuffixNode || !typingSuffixHighlightNode) {
    return;
  }

  const propositions = [
    { prefix: "", highlight: "sites die aanvragen opleveren", suffix: "", suffixHighlight: "" },
    { prefix: "", highlight: "hand\u00ADgeschreven websites", suffix: "", suffixHighlight: "" },
    { prefix: "", highlight: "Google campagnes die klanten trekken", suffix: "", suffixHighlight: "" },
    { prefix: "", highlight: "sites met prachtige animaties", suffix: "", suffixHighlight: "" },
    { prefix: "jouw  ", highlight: "digitale visite\u00ADkaartje", suffix: "", suffixHighlight: "" },
    { prefix: "", highlight: "meta ads-campagnes voor jouw niche", suffix: "", suffixHighlight: "" },
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;
  let isInViewport = true;
  let isTabVisible = !document.hidden;
  let hasBootstrapped = false;

  const observerTarget = typingHighlightNode.closest("section") || typingHighlightNode;

  const shouldAnimate = () => isInViewport && isTabVisible;

  const pauseAnimation = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const scheduleTick = (delay) => {
    pauseAnimation();
    if (!shouldAnimate()) {
      return;
    }
    timeoutId = window.setTimeout(tick, delay);
  };

  const tick = () => {
    if (!shouldAnimate()) {
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
      if (!hasBootstrapped) {
        hasBootstrapped = true;
        typingPrefixNode.textContent = "";
        typingHighlightNode.textContent = "";
        typingSuffixNode.textContent = "";
        typingSuffixHighlightNode.textContent = "";
      }
      scheduleTick(0);
      return;
    }
    pauseAnimation();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  if (typeof IntersectionObserver !== "undefined") {
    const rect = observerTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibilityRatio = rect.height > 0 ? visibleHeight / rect.height : 0;
    isInViewport = visibilityRatio >= 0.1;

    const typingObserver = new IntersectionObserver(
      (entries) => {
        isInViewport = entries.some((entry) => entry.isIntersecting);
        if (shouldAnimate()) {
          if (!hasBootstrapped) {
            hasBootstrapped = true;
            typingPrefixNode.textContent = "";
            typingHighlightNode.textContent = "";
            typingSuffixNode.textContent = "";
            typingSuffixHighlightNode.textContent = "";
          }
          scheduleTick(0);
          return;
        }
        pauseAnimation();
      },
      { threshold: 0.1 }
    );
    typingObserver.observe(observerTarget);
  } else {
    isInViewport = true;
  }

  if (shouldAnimate()) {
    hasBootstrapped = true;
    typingPrefixNode.textContent = "";
    typingHighlightNode.textContent = "";
    typingSuffixNode.textContent = "";
    typingSuffixHighlightNode.textContent = "";
    scheduleTick(350);
  }
}
