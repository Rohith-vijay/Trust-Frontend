import SockJS from "sockjs-client";
import Stomp from "stompjs";
import api from "./api";
import { getWebSocketUrl } from "../utils";

const notificationService = {
  // REST API Endpoints
  getNotifications: async (category = null, isRead = null, search = null, page = 0, size = 15) => {
    const response = await api.get("/notifications", {
      params: { category, isRead, search, page, size }
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post("/notifications/read-all");
    return response.data;
  },

  // STOMP WebSocket Connection Manager with Resilient Auto-Reconnect
  connectWebSocket: (userEmail, onNotificationReceived, onError, onStatusChange) => {
    const socketUrl = getWebSocketUrl();
    let stompClient = null;
    let socket = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;
    let isExplicitDisconnect = false;

    const notifyStatus = (status) => {
      if (onStatusChange) onStatusChange(status);
    };

    const connect = () => {
      if (isExplicitDisconnect) return;

      // Handle offline status immediately
      if (typeof window !== "undefined" && !window.navigator.onLine) {
        notifyStatus("OFFLINE");
        return;
      }
      
      notifyStatus("CONNECTING");

      socket = new SockJS(socketUrl);
      const StompClient = Stomp?.Stomp || Stomp;
      stompClient = StompClient.over(socket);
      stompClient.debug = null;

      stompClient.connect(
        {},
        (frame) => {
          reconnectAttempts = 0;
          notifyStatus("CONNECTED");
          
          // 1. Subscribe to administrative broadcasts if user is an admin
          const storedUser = (() => {
            try { return JSON.parse(localStorage.getItem('trustcore_user') || '{}'); } catch { return {}; }
          })();
          const isAdminUser = storedUser?.role === 'ADMIN';
          if (isAdminUser) {
            stompClient.subscribe("/topic/admin-notifications", (message) => {
              try {
                const notification = JSON.parse(message.body);
                onNotificationReceived(notification);
              } catch (err) {
                console.error("Failed to parse STOMP broadcast message body:", err);
              }
            });
          }

          // 2. Subscribe to user-specific private queue: /user/queue/notifications
          stompClient.subscribe("/user/queue/notifications", (message) => {
            try {
              const notification = JSON.parse(message.body);
              onNotificationReceived(notification);
            } catch (err) {
              console.error("Failed to parse STOMP private message body:", err);
            }
          });
        },
        (error) => {
          console.error("WebSocket STOMP connection error:", error);
          notifyStatus("DISCONNECTED");
          if (onError) onError(error);
          
          // Trigger reconnection loop with exponential backoff (max 30s)
          if (!isExplicitDisconnect) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            reconnectAttempts++;
            reconnectTimeout = setTimeout(connect, delay);
          }
        }
      );
    };

    // Resilient Network state event listeners
    const handleOnline = () => {
      reconnectAttempts = 0;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      connect();
    };

    const handleOffline = () => {
      notifyStatus("OFFLINE");
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    connect();

    // Return a controller object for granular control and cleanups
    return {
      disconnect: (callback) => {
        isExplicitDisconnect = true;
        if (typeof window !== "undefined") {
          window.removeEventListener("online", handleOnline);
          window.removeEventListener("offline", handleOffline);
        }
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
        if (stompClient && stompClient.connected) {
          stompClient.disconnect(() => {
            notifyStatus("DISCONNECTED");
            if (callback) callback();
          });
        } else {
          notifyStatus("DISCONNECTED");
          if (callback) callback();
        }
      },
      getClient: () => stompClient
    };
  }
};

export default notificationService;
