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

// Response interceptor — handle standardized ApiResponse, toasts, and auth redirects
api.interceptors.response.use(
    (response) => {
        const responseData = response.data;
        
        // If it conforms to the standardized ApiResponse structure
        if (responseData && typeof responseData === "object" && "success" in responseData) {
            const { success, message, data } = responseData;
            
            if (success) {
                // Show success toast for write operations (POST, PUT, DELETE, PATCH)
                const method = response.config?.method?.toLowerCase();
                if (method && method !== "get" && message && message !== "Operation successful") {
                    window.dispatchEvent(new CustomEvent("app-toast", {
                        detail: { message, severity: "success" }
                    }));
                }
                
                // Transparently unwrap and replace the response data
                response.data = data;
            }
        }
        
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data: responseData } = error.response;
            const url = error.config?.url || "";

            // Standardized error parsing
            let errorMessage = "An unexpected error occurred.";
            let validationDetails = "";

            if (responseData && typeof responseData === "object") {
                if (responseData.message) {
                    errorMessage = responseData.message;
                }
                
                // Capture field-level validation errors
                if (responseData.errors && typeof responseData.errors === "object") {
                    const fields = Object.entries(responseData.errors);
                    if (fields.length > 0) {
                        validationDetails = fields
                            .map(([field, detail]) => `• ${field}: ${detail}`)
                            .join("\n");
                    }
                }
            }

            // Expose the error message using global toast notifications
            const fullMessage = validationDetails 
                ? `${errorMessage}\n${validationDetails}` 
                : errorMessage;

            // Handle session expirations and permission denials
            if (status === 401) {
                if (!url.includes("/auth/")) {
                    localStorage.removeItem("token");
                    window.dispatchEvent(new CustomEvent("app-toast", {
                        detail: { message: "Session expired. Please log in again.", severity: "warning" }
                    }));
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1500);
                } else {
                    window.dispatchEvent(new CustomEvent("app-toast", {
                        detail: { message: fullMessage, severity: "error" }
                    }));
                }
            } else if (status === 403) {
                window.dispatchEvent(new CustomEvent("app-toast", {
                    detail: { message: "Access denied. You lack permissions for this resource.", severity: "error" }
                }));
                setTimeout(() => {
                    window.location.href = "/unauthorized";
                }, 1500);
            } else {
                // Other API errors (400, 404, 409, 500)
                window.dispatchEvent(new CustomEvent("app-toast", {
                    detail: { message: fullMessage, severity: "error" }
                }));
            }
        } else {
            // Network errors or timeout errors
            window.dispatchEvent(new CustomEvent("app-toast", {
                detail: { message: "Network connection lost. Please check your internet.", severity: "error" }
            }));
        }
        return Promise.reject(error);
    }
);

export default api;
