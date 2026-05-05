const GALLERY_IMAGE_COLUMNS = [
  [
    {
      src: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van team overleg",
    },
    {
      src: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van laptop en bureau",
    },
    {
      src: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van brainstormsessie",
    },
  ],
  [
    {
      src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van creative studio",
    },
    {
      src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van werkplek met schermen",
    },
    {
      src: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van team collaboration",
    },
  ],
  [
    {
      src: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van productiviteit",
    },
    {
      src: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van team planning",
    },
    {
      src: "https://images.pexels.com/photos/3183173/pexels-photo-3183173.jpeg?auto=compress&cs=tinysrgb&w=1400",
      alt: "Stock image van moderne workspace",
    },
  ],
];

const LOOP_REPEATS = 4;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getDistance = (section) => {
  const mobileDistance = Number(section.dataset.distanceMobile ?? 120);
  const desktopDistance = Number(section.dataset.distanceDesktop ?? 250);
  const desktopBreakpoint = Number(section.dataset.distanceBreakpoint ?? 1024);

  return window.innerWidth >= desktopBreakpoint ? desktopDistance : mobileDistance;
};

function renderParallaxGalleryImages() {
  const tracks = [...document.querySelectorAll("[data-parallax-track][data-gallery-column]")];

  tracks.forEach((track) => {
    const columnIndex = Number(track.dataset.galleryColumn ?? -1);
    const columnImages = GALLERY_IMAGE_COLUMNS[columnIndex];

    if (!Array.isArray(columnImages) || !columnImages.length) {
      return;
    }

    const fragment = document.createDocumentFragment();
    track.replaceChildren();

    for (let repeatIndex = 0; repeatIndex < LOOP_REPEATS; repeatIndex += 1) {
      columnImages.forEach(({ src, alt }) => {
        const linkButton = document.createElement("a");
        linkButton.href = "../portfolio";
        linkButton.className = "block overflow-hidden bg-slate-900/70";
        linkButton.setAttribute("aria-label", `${alt} - bekijk cases`);

        if (repeatIndex > 0) {
          linkButton.setAttribute("aria-hidden", "true");
          linkButton.tabIndex = -1;
        }

        const image = document.createElement("img");
        image.src = src;
        image.alt = repeatIndex === 0 ? alt : "";
        image.loading = "lazy";
        image.decoding = "async";
        image.className = "aspect-[16/9] h-full w-full object-cover";

        linkButton.append(image);
        fragment.append(linkButton);
      });
    }

    track.append(fragment);
  });
}

function initOpposingParallaxGallery() {
  const sections = [...document.querySelectorAll("[data-opposing-parallax]")];

  if (!sections.length) {
    return;
  }

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotionQuery.matches) {
    sections.forEach((section) => {
      section.querySelectorAll("[data-parallax-track]").forEach((track) => {
        track.style.transform = "translate3d(0, 0, 0)";
      });
    });
    return;
  }

  const LERP_FACTOR = 0.05;
  const SETTLE_THRESHOLD = 0.05;

  const lerp = (current, target, factor) => current + (target - current) * factor;

  const sectionStates = sections
    .map((section) => {
      const tracks = [...section.querySelectorAll("[data-parallax-track]")];

      if (!tracks.length) {
        return null;
      }

      return {
        section,
        tracks,
        trackCurrentOffsets: new Map(tracks.map((t) => [t, null])),
        isVisible: false,
      };
    })
    .filter(Boolean);

  if (!sectionStates.length) {
    return;
  }

  let animationFrameId = 0;

  const computeTargetOffset = (section, track) => {
    const trackViewport = track.parentElement;

    if (!trackViewport) {
      return 0;
    }

    const sectionRect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const scrollableDistance = sectionRect.height + viewportHeight;
    const progress = clamp((viewportHeight - sectionRect.top) / scrollableDistance, 0, 1);
    const centeredProgress = (progress - 0.5) * 2;
    const distance = getDistance(section);
    const overflowAmount = Math.max(track.offsetHeight - trackViewport.clientHeight, 0);
    const centerOffset = -overflowAmount / 2;
    const direction = track.dataset.direction === "down" ? 1 : -1;
    const speed = Number(track.dataset.speed ?? 1);
    const parallaxOffset = centeredProgress * distance * direction * speed;
    const desiredOffset = centerOffset + parallaxOffset;

    return clamp(desiredOffset, -overflowAmount, 0);
  };

  const loop = () => {
    let stillMoving = false;

    sectionStates.forEach((state) => {
      if (!state.isVisible) {
        return;
      }

      state.tracks.forEach((track) => {
        const target = computeTargetOffset(state.section, track);
        const current = state.trackCurrentOffsets.get(track) ?? target;
        const next = lerp(current, target, LERP_FACTOR);
        const settled = Math.abs(next - target) < SETTLE_THRESHOLD;
        const value = settled ? target : next;

        state.trackCurrentOffsets.set(track, value);
        track.style.transform = `translate3d(0, ${value}px, 0)`;

        if (!settled) {
          stillMoving = true;
        }
      });
    });

    animationFrameId = stillMoving ? window.requestAnimationFrame(loop) : 0;
  };

  const requestUpdate = () => {
    if (animationFrameId) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(loop);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = sectionStates.find(({ section }) => section === entry.target);

        if (!state) {
          return;
        }

        state.isVisible = entry.isIntersecting;
      });

      requestUpdate();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "20% 0% 20% 0%",
    },
  );

  sectionStates.forEach(({ section }) => observer.observe(section));

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  reduceMotionQuery.addEventListener("change", () => {
    if (reduceMotionQuery.matches) {
      sectionStates.forEach(({ tracks }) => {
        tracks.forEach((track) => {
          track.style.transform = "translate3d(0, 0, 0)";
        });
      });
      return;
    }

    requestUpdate();
  });

  requestUpdate();
}

renderParallaxGalleryImages();
initOpposingParallaxGallery();