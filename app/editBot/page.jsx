"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChatBotForm, Modal } from "@/components/ChatBotForm";

const EditBot = () => {
  const [chatbotMessages, setChatbotMessages] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });
  const [editingMessage, setEditingMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    const str = String(text);
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  const fetchChatbotMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/chatBot");
      if (response.data.success) {
        setChatbotMessages(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch messages");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatbotMessages();
  }, [fetchChatbotMessages]);

  const addChatbotMessage = async (messageData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/chatBot", {
        action: "add",
        ...messageData
      });
      if (response.data.success && response.data.message) {
        setChatbotMessages(prevMessages => {
          const newMessages = { ...prevMessages };
          if (!newMessages[messageData.category]) {
            newMessages[messageData.category] = [];
          }
          newMessages[messageData.category].push(response.data.message);
          return newMessages;
        });
        setStatusMessage({ type: 'success', message: "Chatbot message added successfully!" });
        setShowForm(false);

        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to add message");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChatbotMessage = async (messageId, category) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/chatBot/${messageId}`);
      if (response.data.success) {
        setChatbotMessages(prevMessages => {
          const newMessages = { ...prevMessages };
          newMessages[category] = newMessages[category].filter(m => m.id !== messageId);
          if (newMessages[category].length === 0) {
            delete newMessages[category];
          }
          return newMessages;
        });
        setStatusMessage({ type: 'success', message: "Message deleted successfully!" });
      } else {
        throw new Error(response.data.message || "Failed to delete message");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (message, category) => {
    setEditingMessage({ ...message, category });
  };

  const cancelEditing = () => {
    setEditingMessage(null);
  };

  const saveEdit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/chatBot/${editingMessage.id}`, editingMessage);
      if (response.data.success) {
        setChatbotMessages(prevMessages => {
          const newMessages = { ...prevMessages };
          const originalCategory = Object.keys(newMessages).find(cat => 
            newMessages[cat].some(m => m.id === editingMessage.id)
          );
          
          if (originalCategory) {
            newMessages[originalCategory] = newMessages[originalCategory].filter(m => m.id !== editingMessage.id);
            if (newMessages[originalCategory].length === 0) {
              delete newMessages[originalCategory];
            }
          }
          
          if (!newMessages[editingMessage.category]) {
            newMessages[editingMessage.category] = [];
          }
          newMessages[editingMessage.category].push(response.data.message);
          
          return newMessages;
        });
        setEditingMessage(null);
        setStatusMessage({ type: 'success', message: "Message updated successfully!" });
        window.location.reload();
      } else {
        throw new Error(response.data.message || "Failed to update message");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">ChatBot Questions</h1>

      {statusMessage.message && (
        <div className={`border px-4 py-3 rounded mb-4 ${
          statusMessage.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          {statusMessage.message}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        disabled={isLoading}
      >
        Add Question
      </button>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <ChatBotForm onSubmit={addChatbotMessage} onClose={() => setShowForm(false)} />
      </Modal>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Answer</th>
                <th className="px-4 py-2">Is Active</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(chatbotMessages).map(([category, messages]) => 
                messages.map((message, index) => (
                  <tr key={`${category}-${message.id}`} className="text-center border-b">
                    <td className="px-4 py-2">
                      {editingMessage && editingMessage.id === message.id ? (
                        <input 
                          type="text" 
                          value={editingMessage.category} 
                          onChange={(e) => setEditingMessage(prev => ({...prev, category: e.target.value}))}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        category
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingMessage && editingMessage.id === message.id ? (
                        <input 
                          type="text" 
                          value={editingMessage.question} 
                          onChange={(e) => setEditingMessage(prev => ({...prev, question: e.target.value}))}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        truncateText(message.question, 50)
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingMessage && editingMessage.id === message.id ? (
                        <textarea 
                          value={editingMessage.answer} 
                          onChange={(e) => setEditingMessage(prev => ({...prev, answer: e.target.value}))}
                          className="border px-2 py-1 w-full"
                        />
                      ) : (
                        truncateText(message.answer, 100)
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingMessage && editingMessage.id === message.id ? (
                        <select 
                          value={editingMessage.isActive.toString()} 
                          onChange={(e) => setEditingMessage(prev => ({...prev, isActive: e.target.value === 'true'}))}
                          className="border px-2 py-1"
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        message.isActive ? 'Yes' : 'No'
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editingMessage && editingMessage.id === message.id ? (
                        <>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg w-full mb-2"
                            onClick={saveEdit}
                            disabled={isLoading}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-500 text-white px-2 py-1 rounded-lg w-full"
                            onClick={cancelEditing}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded-lg w-full mb-2"
                            onClick={() => startEditing(message, category)}
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded-lg w-full p-2"
                            onClick={() => deleteChatbotMessage(message.id, category)}
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditBot;