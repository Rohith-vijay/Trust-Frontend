// api.js — Axios instance configured for Spring Boot JWT backend

import axios from "axios";
import { getBackendUrl } from "../utils";

// Base URL for the Spring Boot API
const API_BASE_URL = getBackendUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor — attach access token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("trustcore_access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });
    failedQueue = [];
};

// Response interceptor — handle standardized ApiResponse, toasts, silent refresh, and auth redirects
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
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't intercept 401s for login/auth endpoints, let them handle it
            if (originalRequest.url?.includes("/auth/")) {
                const responseData = error.response.data;
                let errorMessage = "Authentication failed.";
                if (responseData && responseData.message) {
                    errorMessage = responseData.message;
                }
                window.dispatchEvent(new CustomEvent("app-toast", {
                    detail: { message: errorMessage, severity: "error" }
                }));
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token && originalRequest.headers) {
                            originalRequest.headers["Authorization"] = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Read refresh token from localStorage
                const refreshToken = localStorage.getItem('trustcore_refresh_token');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const refreshResponse = await api.post('/auth/refresh', { refreshToken });
                const refreshData = refreshResponse.data;
                const newToken = refreshData?.token;

                if (refreshData && refreshData.token) {
                    localStorage.setItem('trustcore_access_token', refreshData.token);
                }
                if (refreshData && refreshData.refreshToken) {
                    localStorage.setItem('trustcore_refresh_token', refreshData.refreshToken);
                }

                if (newToken && originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                }

                processQueue(null, newToken);
                return api(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('trustcore_access_token');
                localStorage.removeItem('trustcore_refresh_token');
                localStorage.removeItem('trustcore_user');
                window.dispatchEvent(new CustomEvent("app-toast", {
                    detail: { message: "Session expired. Please log in again.", severity: "warning" }
                }));
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.config?.skipGlobalToast) {
            return Promise.reject(error);
        }

        if (error.response) {
            const { status, data: responseData } = error.response;

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

            if (status === 403) {
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
