"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NotificationForm, Modal } from "@/components/NotificationForm";
import EditNotificationForm from "@/components/EditNotificationForm";

const PushNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 10; // Limit to 10 notifications per page
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);

  // Define the truncateText function
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);

        const eventsResponse = await axios.get("/api/post");
        const events = eventsResponse.data;

        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);

        events.forEach(event => {
          const eventStartDate = new Date(event.start_date);
          if (eventStartDate <= threeDaysFromNow && eventStartDate >= today) {
            const notificationTitle = `เชิญชวนเข้าร่วมกิจกรรม "${event.title}"`;
            const notificationMessage = `ขอเชิญนักศึกษาและบุคลากรทุกท่านเข้าร่วมกิจกรรม "${event.title}"...`;

            const notificationData = {
              title: notificationTitle,
              message: notificationMessage,
              scheduledTime: eventStartDate.toISOString(),
            };

            axios.post("/api/notifications", notificationData)
              .then(res => {
                setNotifications(prev => [...prev, res.data.notification]);
              })
              .catch(err => {
                console.error("Error creating automatic notification:", err);
              });
          }
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const sendNotification = async ({ title, message, scheduledTime }) => {
    try {
      const response = await axios.post("/api/notifications", {
        title,
        message,
        scheduledTime,
      });

      setSuccessMessage("Notification created successfully!");
      setNotifications([...notifications, response.data.notification]);
      setShowForm(false);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    const confirmed = window.confirm("ยืนยันที่จะลบการแจ้งเตือนนี้ใช่ไหม?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      if (response.status === 200) {
        setNotifications(notifications.filter(n => n._id !== notificationId));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const editNotification = async (id, updatedTitle, updatedMessage, updatedScheduledTime) => {
    try {
      const response = await axios.patch(`/api/notifications/${id}/edit`, {
        title: updatedTitle,
        message: updatedMessage,
        scheduledTime: updatedScheduledTime,
      });
      setNotifications(
        notifications.map((n) => (n._id === id ? response.data.notification : n))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  // Pagination logic: Slicing notifications for the current page
  const currentNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">การเเจ้งเตือน</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Notification
        </button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <NotificationForm onSubmit={sendNotification} onClose={() => setShowForm(false)} />
      </Modal>

      {selectedNotification && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <EditNotificationForm
            initialData={selectedNotification}
            onSubmit={(data) => editNotification(selectedNotification._id, data.title, data.message, data.scheduledTime)}
            onClose={() => setShowEditModal(false)}
          />
        </Modal>
      )}

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
            {currentNotifications.map((notification, index) => (
              <tr key={index} className="text-center border-b">
                <td className="px-4 py-2">{truncateText(notification.title, 50)}</td>
                <td className="px-4 py-2">{truncateText(notification.message, 75)}</td>
                <td className="px-4 py-2">
                  {new Date(notification.scheduledTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleEdit(notification)}
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

      {/* Pagination Buttons */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 px-3 py-1 rounded-lg border ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PushNotification;
