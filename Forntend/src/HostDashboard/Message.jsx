import { useEffect, useState, useRef } from "react";
import { useAuth } from "../PropertyDetails/AuthContext.jsx";
import socket from "../socket.js";

export default function Message() {
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hostId = user?.host?._id;
  const hostRoomId = hostId ? String(hostId) : null;

  // Fetch latest notifications from backend
  useEffect(() => {
    const fetchLatestNotifications = async () => {
      try {
        const response = await fetch(
          "https://wanderlust-1-s261.onrender.com/api/notifications/latest",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log("Fetched notifications:", data);

        if (data.success) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (!loading && user) {
      fetchLatestNotifications();
    }
  }, [loading, user]);

  // Join socket room
  useEffect(() => {
    if (!hostRoomId) return;

    const joinHostRoom = () => {
      socket.emit("join", hostRoomId);
    };

    if (socket.connected) {
      joinHostRoom();
    }

    socket.on("connect", joinHostRoom);

    return () => {
      socket.off("connect", joinHostRoom);
    };
  }, [hostRoomId]);

  // Realtime new notification
  useEffect(() => {
    const handleNewBooking = (payload) => {
      const newNotification = {
        _id: payload?._id || Date.now().toString(),
        message: payload?.message || "New reservation received!",
        createdAt: payload?.createdAt || new Date().toISOString(),
        isRead: payload?.isRead ?? false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    socket.on("new-booking", handleNewBooking);

    return () => {
      socket.off("new-booking", handleNewBooking);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    // when opening dropdown, mark all unread notifications as read
    if (nextOpen && unreadCount > 0) {
      try {
        const response = await fetch(
          "https://wanderlust-1-s261.onrender.com/api/notifications/read-all",
          {
            method: "PATCH",
            credentials: "include",
          }
        );

        const data = await response.json();
        console.log("Mark read response:", data);

        if (data.success) {
          setNotifications((prev) =>
            prev.map((n) => ({
              ...n,
              isRead: true,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        onClick={handleToggle}
        style={{
          position: "relative",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          cursor: "pointer",
          fontSize: "20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🔔

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              minWidth: "20px",
              height: "20px",
              fontSize: "11px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              padding: "2px 4px",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "55px",
            right: "0",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            border: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span>Notifications</span>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                style={{
                  background: "none",
                  border: "none",
                  color: "red",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p
              style={{
                padding: "16px",
                color: "#666",
                margin: 0,
              }}
            >
              No notifications yet
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #f1f1f1",
                  backgroundColor: n.isRead ? "#fff" : "#f5faff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{n.message}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      marginTop: "4px",
                    }}
                  >
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => removeNotification(n._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#666",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}