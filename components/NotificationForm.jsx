import React, { useState } from "react";

const NotificationForm = ({ onSubmit, onClose }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, message, scheduledTime });
    setTitle("");
    setMessage("");
    setScheduledTime("");
  };

  return (
    <div className="mb-8 relative top-5 ">
      <h2 className="text-xl font-bold mb-4">Create Notification</h2>
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
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Send Notification
          </button>
        </div>
      </form>
    </div>
  );
};

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
       
        </button>
        {children}
      </div>
    </div>
  );
};

export { NotificationForm, Modal };