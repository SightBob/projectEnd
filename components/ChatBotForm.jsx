import React, { useState } from "react";

const ChatBotForm = ({ onSubmit, onClose }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState(true); 

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ question, answer, category, isActive });
    setQuestion("");
    setAnswer("");
    setCategory("");
    setIsActive(true);
  };

  return (
    <div className="mb-8 relative top-5 ">
      <h2 className="text-xl font-bold mb-4">Create Chatbot Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
          className="border px-4 py-2 w-full mb-2"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
          className="border px-4 py-2 w-full mb-2"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
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
            Save Question
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

export { ChatBotForm, Modal };