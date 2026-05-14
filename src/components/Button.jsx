import React from "react";

function Button({ children, className = "", ...props }) {
  // simple ripple effect using CSS animation triggered by pointer events
  const handleClick = (e) => {
    const btn = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - btn.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - btn.offsetTop - radius}px`;
    circle.classList.add("ripple");
    const ripple = btn.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }
    btn.appendChild(circle);
    if (props.onClick) props.onClick(e);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative overflow-hidden bg-primary text-white px-8 py-3 rounded-xl font-semibold shadow transition transform hover:scale-105 active:scale-95 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
