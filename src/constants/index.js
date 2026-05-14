// central place for app-wide constants such as routes, configuration keys, etc.

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  DONATION: "/donation",
  EVENTS: "/events",
  HISTORY: "/history",
  CONTACT: "/contact",
  VOLUNTEER: "/volunteer",
  VISION: "/vision",
  LOGIN: "/login",
  SIGNUP: "/signup",
  UNAUTHORIZED: "/unauthorized",
  ADMIN: "/admin",
};

export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  VOLUNTEER: "VOLUNTEER",
};

export const APP_NAME = "K.V.G Shanmuka Sai Charitable Trust";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
