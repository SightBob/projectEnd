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
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch user data
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/allUser");
      if (response.data.success) {
        // Check if the API returns user IDs as `_id` or something else
        const users = response.data.data.map(user => ({
          ...user,
          id: user._id // Use `_id` if that's the correct field name
        }));
        setAllUsers(users);
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
    console.log("Updated User ID:", updatedUser.id); // This should log the correct ID
    setIsLoading(true);
    try {
      if (!updatedUser.id) {
        throw new Error("User ID is missing!");
      }
  
      const response = await axios.patch(`/api/allUser/${updatedUser.id}`, updatedUser);
      
      if (response?.data?.success) {
        setAllUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        window.location.reload();
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
const handleDelete = async (userId) => {
  try {
      const response = await fetch(`/api/allUser/${userId}`, {
          method: 'DELETE', // Ensure you are using DELETE
      });

      if (response.status === 405) {
          console.error("Method Not Allowed: Check if the API supports this method");
          return;
      }

      const data = await response.json();
      if (data.success) {
          console.log(data.message); // User deleted successfully
          // Update your UI accordingly
      } else {
          console.error(data.message); // Handle error message
      }
  } catch (error) {
      console.error("Error deleting user:", error);
  }
};



  // Filtered users based on search term
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="w-full py-3">
        <form className="flex items-center max-w-sm">
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 -6 44 44">
                <path d="M42 32H14.01a2 2 0 0 1-2-2v-2c0-.36.2-.7.52-.88l9.79-5.33c-3.28-3.55-3.32-8.56-3.32-8.8L19.01 7a1 1 0 0 1 .01-.16C19.72 2.75 24.22 0 28 0 31.8 0 36.3 2.75 37 6.83L37 7v6c0 .22-.03 5.24-3.3 8.79l9.78 5.33A1 1 0 0 1 44 28v2a2 2 0 0 1-2 2Zm-10.47-9.12a1 1 0 0 1-.16-1.65c3.6-2.92 3.64-8.18 3.64-8.24V7.1c-.57-3-4.13-5.08-7-5.08-2.88 0-6.44 2.08-7 5.08V13c0 .06.05 5.34 3.63 8.24a1 1 0 0 1-.16 1.65L14.01 28.6V30H42v-1.4l-10.47-5.72ZM18.65 2.52A7.42 7.42 0 0 0 16 2c-2.88 0-6.44 2.08-7 5.08v5.9c0 .06.05 5.34 3.63 8.24a1 1 0 0 1-.16 1.65L2 28.6v1.4h7a1 1 0 0 1 0 2H2a2 2 0 0 1-2-2v-2c0-.36.2-.7.52-.87l9.79-5.34c-3.28-3.55-3.32-8.56-3.32-8.8V7l.02-.16C7.71 2.74 12.21 0 16 0h.02c1.1 0 2.25.23 3.36.66a1 1 0 1 1-.72 1.86Z"/>
              </svg>
            </div>
            <input 
              type="text" 
              id="simple-search" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 focus:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="ค้นหารายชื่อ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

        <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <UserForm
          user={editingUser}
          onSubmit={saveEdit}
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
                <th className="px-4 py-2">faculty</th>
                <th className="px-4 py-2">major</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-center border-b">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.firstname}</td>
                  <td className="px-4 py-2">{user.lastname}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.faculty}</td>
                  <td className="px-4 py-2">{user.major}</td>
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
                    onClick={() => {
                      const confirmDelete = window.confirm("Are you sure you want to delete this user?");
                      if (confirmDelete) {
                        handleDelete(user.id);
                      }
                    }}
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
