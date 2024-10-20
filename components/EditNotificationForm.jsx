import React, { useState, useEffect } from "react";

const EditNotificationForm = ({ initialData, onSubmit, onClose }) => {
    const [title, setTitle] = useState(initialData.title);
    const [message, setMessage] = useState(initialData.message);
    const [scheduledTime, setScheduledTime] = useState(new Date(initialData.scheduledTime).toISOString().substring(0, 16)); // แปลงให้เป็นรูปแบบที่ใช้ใน input type="datetime-local"

  // Set initial form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMessage(initialData.message);
      setScheduledTime(new Date(initialData.scheduledTime).toISOString().slice(0, 16)); // Convert to datetime-local format
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, message, scheduledTime });
  };
  
  

  return (
    <div className="mb-8 relative top-5">
      <h2 className="text-xl font-bold mb-4">Edit Notification</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          className="border px-4 py-2 w-full mb-2"
        />
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Save Changes
          </button>
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNotificationForm;
