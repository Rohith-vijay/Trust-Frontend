// api.js — Axios instance configured for Spring Boot JWT backend

import axios from "axios";

// Base URL for the Spring Boot API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — attach JWT Bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401/403
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;

            if (status === 401) {
                // Don't intercept 401s from auth endpoints (login, register, etc.)
                // — let the calling component handle those errors directly
                const url = error.config?.url || "";
                if (!url.startsWith("/auth/")) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                }
            }

            if (status === 403) {
                // User lacks permissions
                window.location.href = "/unauthorized";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
