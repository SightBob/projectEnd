"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const PushNotification = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Fetch all notifications on load
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Send notification function
  const sendNotification = async () => {
    try {
      const response = await axios.post("/api/notifications", {
        title,
        message,
      });
      console.log("Notification sent:", response.data);

      // Optionally update the notifications list
      setNotifications([...notifications, response.data.notification]);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Resend notification function
  const resendNotification = async (notification) => {
    try {
      const response = await axios.post("/api/notifications/resend", {
        title: notification.title,
        message: notification.message,
      });
      console.log("Notification resent:", response.data);
    } catch (error) {
      console.error("Error resending notification:", error);
    }
  };
  async function deleteNotification(notificationId) {
    const response = await fetch('/api/notifications', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: notificationId }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to delete notification:', errorData);
      return;
    }
  
    const data = await response.json();
    console.log(data.message); // Notification deleted successfully
  }
  
  
  
  // Function to edit a notification
  const editNotification = async (id, updatedTitle, updatedMessage) => {
    try {
      const response = await axios.patch(`/api/notifications/${id}/edit`, {
        title: updatedTitle,
        message: updatedMessage,
      });
      console.log("Notification updated:", response.data);
      // อัปเดตการแจ้งเตือนใน state
      setNotifications(
        notifications.map((n) => (n._id === id ? response.data.notification : n))
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Push Notifications</h1>

      {/* Notification Form */}
      <div className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border px-4 py-2 w-full mb-2"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="border px-4 py-2 w-full mb-2"
        />
        <div className="flex justify-end">
          <button
            onClick={sendNotification}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Send Notification
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Date Added</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
  {notifications.map((notification, index) => (
    <tr key={index} className="text-center border-b">
      <td className="px-4 py-2">{notification.title}</td>
      <td className="px-4 py-2">{notification.message}</td>
      <td className="px-4 py-2">{notification.isRead ? "Read" : "Unread"}</td>
      <td className="px-4 py-2">
        {new Date(notification.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded-lg"
          onClick={() => resendNotification(notification)}
        >
          Resend
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded-lg ml-2"
          onClick={() =>
            editNotification(
              notification._id,
              prompt("Enter new title:", notification.title),
              prompt("Enter new message:", notification.message)
            )
          }
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded-lg ml-2"
          onClick={() => deleteNotification(notification._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
};

export default PushNotification;
