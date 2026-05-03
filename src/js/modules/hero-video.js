export function initHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");
  const heroOverlay = document.querySelector("[data-hero-overlay]");

  if (heroOverlay instanceof HTMLElement) {
    requestAnimationFrame(() => {
      heroOverlay.classList.remove("bg-[#3d3a42ed]");
      heroOverlay.classList.add("bg-[#3d3a42cf]");
    });
  }

  if (!(heroVideo instanceof HTMLVideoElement)) {
    return;
  }

  const setPlaybackRate = () => {
    heroVideo.playbackRate = 3;
    heroVideo.defaultPlaybackRate = 3;
  };

  setPlaybackRate();
  heroVideo.addEventListener("loadedmetadata", setPlaybackRate);
}