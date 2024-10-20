"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { NotificationForm, Modal } from "@/components/NotificationForm";
import EditNotificationForm from "@/components/EditNotificationForm";

 
 
const PushNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal visibility
  const [selectedNotification, setSelectedNotification] = useState(null); // State for the notification being edited

  // Define the truncateText function
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  // Fetch all notifications and create automatic notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch current notifications
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);

        // Fetch upcoming events
        const eventsResponse = await axios.get("/api/post"); // Adjust this endpoint as needed
        const events = eventsResponse.data;

        // Get today's date and the date three days from now
        const today = new Date();
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);

        // Loop through events and create notifications for upcoming events
        events.forEach(event => {
          const eventStartDate = new Date(event.start_date);
          if (eventStartDate <= threeDaysFromNow && eventStartDate >= today) {
            const notificationTitle = `เชิญชวนเข้าร่วมกิจกรรม "${event.title}"`;
            const notificationMessage = `ขอเชิญนักศึกษาและบุคลากรทุกท่านเข้าร่วมกิจกรรม "${event.title}"...`;

            // Create notification data
            const notificationData = {
              title: notificationTitle,
              message: notificationMessage,
              scheduledTime: eventStartDate.toISOString(), // Set to the event start date for notification
            };

            // Send notification to database
            axios.post("/api/notifications", notificationData)
              .then(res => {
                console.log("Automatic notification created:", res.data);
                setNotifications(prev => [...prev, res.data.notification]); // Update notifications in state
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

      // Update notifications list
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
    const confirmed = window.confirm("ยืนยันที่จะลบการแจ้งเตือนนี้ใช่ไหม?");
    if (!confirmed) {
      return; // If the user clicks "Cancel", exit the function
    }

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

  // Function to open the edit modal with the selected notification
  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  // Function to edit a notification
  const editNotification = async (id, updatedTitle, updatedMessage, updatedScheduledTime) => {
    try {
      const response = await axios.patch(`/api/notifications/${id}/edit`, {
        title: updatedTitle,
        message: updatedMessage,
        scheduledTime: updatedScheduledTime,
      });
      console.log("Notification updated:", response.data);
      setNotifications(
        notifications.map((n) => (n._id === id ? response.data.notification : n))
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };
  
  
  
  
  
  



  
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">การเเจ้งเตือน</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Button to toggle form visibility */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Add Notification
        </button>
      </div>

      {/* Modal for NotificationForm */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <NotificationForm onSubmit={sendNotification} onClose={() => setShowForm(false)} />
      </Modal>

      {/* Edit Notification Modal */}
     {/* Edit Notification Modal */}
{selectedNotification && (
  <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
   <EditNotificationForm
  initialData={selectedNotification}
  onSubmit={(data) => editNotification(selectedNotification._id, data.title, data.message, data.scheduledTime)}
  onClose={() => setShowEditModal(false)}
/>

  </Modal>
)}


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
                <td className="px-4 py-2">{truncateText(notification.message, 75)}</td>
                <td className="px-4 py-2">
                  {new Date(notification.scheduledTime).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-lg"
                    onClick={() => handleEdit(notification)} // Open the edit modal
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
