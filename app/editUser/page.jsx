"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { UserForm, Modal } from "@/components/UserForm";

const EditUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

  // Fetch user data
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
        console.log("เข้ามานะ");
      const response = await axios.get("/api/allUser");
      if (response.data.success) {
        setAllUsers(response.data.data);
        console.log("เห็นแล้ว", response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Start editing user
  const startEditing = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Save user changes
  const saveEdit = async (updatedUser) => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/api/users/${updatedUser.id}`, updatedUser); // Adjust the API route
      if (response.data.success) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setStatusMessage({ type: 'success', message: 'User updated successfully' });
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
      setShowForm(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/api/users/${userId}`); 
      if (response.data.success) {
        setAllUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        setStatusMessage({ type: 'success', message: 'User deleted successfully' });
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">จัดการผู้ใช้</h1>

      {statusMessage.message && (
        <div
          className={`border px-4 py-3 rounded mb-4 ${
            statusMessage.type === "success"
              ? "bg-green-100 border-green-400 text-green-700"
              : "bg-red-100 border-red-400 text-red-700"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4"
        disabled={isLoading}
      >
        Add User
      </button>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <UserForm
          user={editingUser}
          onSave={saveEdit}
          onClose={() => setShowForm(false)}
        />
      </Modal>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">First Name</th>
                <th className="px-4 py-2">Last Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="text-center border-b">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.firstname}</td>
                  <td className="px-4 py-2">{user.lastname}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded-lg w-full mb-2"
                      onClick={() => startEditing(user)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded-lg w-full"
                      onClick={() => deleteUser(user.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EditUser;
