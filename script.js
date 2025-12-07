// script.js

document.addEventListener("DOMContentLoaded", () => {
  setupYear();
  setupScrollReveal();
  setupProjectVideosAutoplay();
});

/* ========== FOOTER YEAR ========== */
function setupYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* ========== SCROLL REVEAL ========== */
function setupScrollReveal() {
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    // Fallback: just keep everything visible
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          // Element came into view → fade in
          el.classList.add("is-visible");
        } else {
          // Element left viewport → reset so it can animate again next time
          el.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealEls.forEach((el, index) => {
    const delayStep = index % 3;
    if (delayStep > 0) {
      el.setAttribute("data-delay", String(delayStep));
    }
    observer.observe(el);
  });
}


/* ========== PROJECT VIDEOS (ALWAYS PLAYING) ========== */
function setupProjectVideosAutoplay() {
  const videos = document.querySelectorAll(".project-video");

  if (!videos.length) return;

  videos.forEach((video) => {
    // Ensure correct attributes for autoplay behavior
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // Try to autoplay when ready
    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            // successfully playing
          })
          .catch(() => {
            // Some browsers may block autoplay even if muted.
            // We could optionally add a "tap to play" overlay here if needed.
          });
      }
    };

    // If metadata already loaded, try to play immediately
    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }
  });

  // Optional: if you want videos to restart playing when user revisits tab
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      videos.forEach((video) => {
        if (video.paused) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch(() => {});
          }
        }
      });
    }
  });
}
