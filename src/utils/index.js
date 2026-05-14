// generic utility helpers used across the application

export const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString();
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
