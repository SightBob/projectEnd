"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NotificationForm, Modal } from "@/components/NotificationForm"; // Correct import statement

const PushNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [successMessage, setSuccessMessage] = useState("");

  // Define the truncateText function
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

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
  const sendNotification = async ({ title, message, scheduledTime }) => {
    try {
      const response = await axios.post("/api/notifications", {
        title,
        message,
        scheduledTime,
      });
      console.log("Notification sent:", response.data);

      // Display success message
      setSuccessMessage("Notification created successfully!");

      // Optionally update the notifications list
      setNotifications([...notifications, response.data.notification]);

      // Close the form
      setShowForm(false);

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000); // 2-second delay before refreshing
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Delete notification function
  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      if (response.status === 200) {
        console.log('Notification deleted successfully');
        // Update the notifications list
        setNotifications(notifications.filter(n => n._id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Function to edit a notification
  const editNotification = async (id, updatedTitle, updatedMessage) => {
    try {
      const response = await axios.patch(`/api/notifications/${id}/edit`, {
        title: updatedTitle,
        message: updatedMessage,
      });
      console.log("Notification updated:", response.data);
      // Update the notification in state
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

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Button to toggle form visibility */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add Notification
      </button>

      {/* Modal for NotificationForm */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <NotificationForm onSubmit={sendNotification} onClose={() => setShowForm(false)} />
      </Modal>

      {/* Notification List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2">Sending Time</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index} className="text-center border-b">
                <td className="px-4 py-2">{truncateText(notification.title, 50)}</td>
                <td className="px-4 py-2">{truncateText(notification.message, 100)}</td>
                <td className="px-4 py-2">
                  {new Date(notification.scheduledTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-lg"
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