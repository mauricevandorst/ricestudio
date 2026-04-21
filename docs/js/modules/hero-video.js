export function initHeroVideo() {
  const heroVideo = document.querySelector("[data-hero-video]");

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