import React, { useState, useEffect } from "react";

const UserForm = ({ onSubmit, onClose, user }) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  // If editing an existing user, populate fields with user data
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setEmail(user.email);
      setIsActive(user.isActive);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, firstname, lastname, email, isActive });
    setUsername("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setIsActive(true);
  };

  return (
    <div className="mb-8 relative top-5">
      <h2 className="text-xl font-bold mb-4">
        {user ? "Edit User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          placeholder="First Name"
          className="border px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last Name"
          className="border px-4 py-2 w-full mb-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border px-4 py-2 w-full mb-2"
        />
        <select
          value={isActive.toString()}
          onChange={(e) => setIsActive(e.target.value === "true")}
          className="border px-4 py-2 w-full mb-2"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {user ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-lg relative">
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

export { UserForm, Modal };
