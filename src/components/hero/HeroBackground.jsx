import { memo, useEffect, useRef, useState, useSyncExternalStore } from "react";
import PropTypes from "prop-types";

/**
 * Pick the portrait asset on tall viewports (phones, portrait tablets) and the
 * landscape asset everywhere else, so every device gets a well-framed clip
 * without downloading the wrong file.
 */
const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";

function useMediaQuery(query) {
  return useSyncExternalStore(
    (notify) => {
      if (!window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", notify);
      return () => mql.removeEventListener("change", notify);
    },
    () => (window.matchMedia ? window.matchMedia(query).matches : false),
    () => false
  );
}

/** True when the user/browser asks us not to autoplay motion or burn data. */
function shouldAvoidVideo() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ""))) return true;
  return false;
}

const HeroBackground = memo(function HeroBackground({
  src,
  alt = "Charity Mission Collage",
  videoLandscape,
  videoPortrait,
  posterLandscape,
  posterPortrait,
  muted = true,
  onMutedChange,
  onFilmState,
}) {
  const videoRef = useRef(null);
  const isPortrait = useMediaQuery(PORTRAIT_QUERY);
  const [videoFailed, setVideoFailed] = useState(false);
  // Track WHICH source is playing, so a rotation (new src) automatically resets to the poster
  const [readySrc, setReadySrc] = useState("");
  const [avoidVideo] = useState(shouldAvoidVideo);

  const videoSrc = (isPortrait ? videoPortrait || videoLandscape : videoLandscape || videoPortrait) || "";
  const poster = (isPortrait ? posterPortrait || posterLandscape : posterLandscape || posterPortrait) || src;
  const useVideo = Boolean(videoSrc) && !avoidVideo && !videoFailed;

  // Sound: the video always starts muted (browsers block autoplay with sound); the parent's button unmutes
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = muted;
    if (!muted && el.paused) el.play().catch(() => onMutedChange?.(true));
  }, [muted, useVideo, videoSrc, onMutedChange]);

  // Tell the page when the film is on its first pass (header stays see-through) and when it has looped once
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !useVideo) {
      onFilmState?.("done");
      return undefined;
    }
    let last = 0;
    const onTime = () => {
      if (el.currentTime + 0.5 < last) onFilmState?.("done"); // wrapped around: first play-through finished
      last = el.currentTime;
    };
    const onPlay = () => onFilmState?.(last < 1 ? "intro" : "done");
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("playing", onPlay, { once: true });
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("playing", onPlay);
    };
  }, [useVideo, videoSrc, onFilmState]);

  // Pause when scrolled out of view or the tab is hidden (saves battery & CPU)
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !useVideo) return undefined;

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) {
        const p = el.play();
        if (p && typeof p.then === "function") {
          // Also mark ready here: 'playing' can fire before React attaches onPlaying
          p.then(() => setReadySrc(videoSrc)).catch(() => {
            if (el.muted) setVideoFailed(true);
            else {
              el.muted = true; // browser refused sound: fall back to silent playback
              onMutedChange?.(true);
              el.play().catch(() => setVideoFailed(true));
            }
          });
        }
      } else {
        el.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [useVideo, videoSrc, onMutedChange]);

  return (
    <div className={`hero__background-container${useVideo ? " has-video" : ""}`}>
      {/* Poster/still stays underneath: it is the LCP element and the fallback */}
      <img
        src={poster}
        alt={useVideo ? "" : alt}
        aria-hidden={useVideo ? "true" : undefined}
        className="hero__background-image"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
      {useVideo && (
        <video
          key={videoSrc}
          ref={videoRef}
          className={`hero__background-video${readySrc === videoSrc ? " is-ready" : ""}`}
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setReadySrc(videoSrc)}
          onError={() => setVideoFailed(true)}
        />
      )}
    </div>
  );
});

HeroBackground.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  videoLandscape: PropTypes.string,
  videoPortrait: PropTypes.string,
  posterLandscape: PropTypes.string,
  posterPortrait: PropTypes.string,
  muted: PropTypes.bool,
  onMutedChange: PropTypes.func,
  onFilmState: PropTypes.func,
};

export default HeroBackground;
