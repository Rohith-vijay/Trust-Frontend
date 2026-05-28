import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * CursorReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders two layered images. A feathered circular SVG mask follows the cursor
 * (with lerp interpolation for smooth movement) revealing the hidden image.
 *
 * Props:
 *   baseImage    — always-visible background image URL
 *   revealImage  — image revealed under the spotlight
 *   alt          — accessible alt text
 *   revealSize   — spotlight diameter in px (default 280)
 *   lerpFactor   — interpolation speed 0-1 (default 0.085)
 *   accentColor  — rgba glow tint colour
 */
const CursorReveal = React.memo(function CursorReveal({
  baseImage,
  revealImage,
  alt = "Impact image",
  revealSize = 280,
  lerpFactor = 0.085,
  accentColor = "rgba(245,158,11,0.18)",
  className = "",
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const targetPos = useRef({ x: -9999, y: -9999 });
  const currentPos = useRef({ x: -9999, y: -9999 });
  const maskCircleRef = useRef(null);
  const glowRef = useRef(null);
  const revealLayerRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Unique SVG filter/mask IDs to avoid collisions when multiple cards render
  const uid = useRef(`reveal-${Math.random().toString(36).slice(2, 9)}`).current;
  const maskId = `mask-${uid}`;
  const filterId = `filter-${uid}`;

  /** Linear interpolation */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Animation loop — runs only while hovered */
  const animate = useCallback(() => {
    const factor = shouldReduceMotion ? 1 : lerpFactor;
    currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, factor);
    currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, factor);

    const cx = currentPos.current.x;
    const cy = currentPos.current.y;

    if (maskCircleRef.current) {
      maskCircleRef.current.setAttribute("cx", cx);
      maskCircleRef.current.setAttribute("cy", cy);
    }
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${cx - revealSize / 2}px, ${cy - revealSize / 2}px)`;
    }
    if (revealLayerRef.current) {
      revealLayerRef.current.style.clipPath = `circle(${revealSize / 2}px at ${cx}px ${cy}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [lerpFactor, revealSize, shouldReduceMotion]);

  const startLoop = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => () => stopLoop(), [stopLoop]);

  /** Mouse handlers */
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetPos.current.x = e.clientX - rect.left;
    targetPos.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseEnter = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Snap current to target on entry to avoid flying from corner
      currentPos.current = { x, y };
      targetPos.current = { x, y };
    }
    setIsHovered(true);
    startLoop();
  }, [startLoop]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    stopLoop();
    // Reset mask & reveal layer
    targetPos.current = { x: -9999, y: -9999 };
    currentPos.current = { x: -9999, y: -9999 };
    if (maskCircleRef.current) {
      maskCircleRef.current.setAttribute("cx", -9999);
      maskCircleRef.current.setAttribute("cy", -9999);
    }
    if (revealLayerRef.current) {
      revealLayerRef.current.style.clipPath = "circle(0px at -9999px -9999px)";
    }
    if (glowRef.current) {
      glowRef.current.style.transform = "translate(-9999px, -9999px)";
    }
  }, [stopLoop]);

  /** Touch handlers — auto-animate reveal across the card */
  const touchAnimRef = useRef(null);
  const touchPhaseRef = useRef(0);

  const handleTouchStart = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    currentPos.current = { x, y };
    targetPos.current = { x, y };
    setIsTouched(true);
    startLoop();
  }, [startLoop]);

  const handleTouchMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touch = e.touches[0];
    targetPos.current.x = touch.clientX - rect.left;
    targetPos.current.y = touch.clientY - rect.top;
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouched(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  const isActive = isHovered || isTouched;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-none select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Hidden SVG mask definition ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <circle
              ref={maskCircleRef}
              cx={-9999}
              cy={-9999}
              r={revealSize / 2}
              fill="white"
              filter={`url(#${filterId})`}
            />
          </mask>
        </defs>
      </svg>

      {/* ── Base image layer ── */}
      <img
        src={baseImage}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: isActive ? "scale(1.04)" : "scale(1)" }}
      />

      {/* ── Reveal image layer — clipped by CSS clip-path ── */}
      <div
        ref={revealLayerRef}
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: "circle(0px at -9999px -9999px)",
          willChange: "clip-path",
        }}
        aria-hidden="true"
      >
        <img
          src={revealImage}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Cinematic colour overlay on reveal layer */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Ambient glow dot that follows cursor ── */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: revealSize,
          height: revealSize,
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          borderRadius: "50%",
          transform: "translate(-9999px, -9999px)",
          willChange: "transform",
          filter: "blur(8px)",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* ── Custom cursor dot ── */}
      <motion.div
        className="absolute pointer-events-none z-20"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.9)",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(4px)",
          transform: "translate(-50%, -50%)",
          willChange: "opacity",
        }}
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.5,
          left: currentPos.current.x,
          top: currentPos.current.y,
        }}
        transition={{ duration: 0 }} // position driven by rAF, not motion
      />
    </div>
  );
});

export default CursorReveal;
