"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal'; // Import the Modal component

const PostActivity = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/getdata'); // Fetch posts with user data
        // Sort posts by start date and time
        const sortedPosts = response.data.sort((a, b) => {
          const dateA = new Date(`${a.start_date}T${a.start_time}`);
          const dateB = new Date(`${b.start_date}T${b.start_time}`);
          return dateA - dateB; // Ascending order
        });
        setPosts(sortedPosts);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleCheckboxChange = (id) => {
    const updatedSelectedPosts = new Set(selectedPosts);
    if (updatedSelectedPosts.has(id)) {
      updatedSelectedPosts.delete(id);
    } else {
      updatedSelectedPosts.add(id);
    }
    setSelectedPosts(updatedSelectedPosts);
  };

  const handleDelete = async () => {
    try {
      await Promise.all([...selectedPosts].map(id => 
        axios.delete('/api/getdata', { data: { id } })
      ));
      setPosts(posts.filter(post => !selectedPosts.has(post._id)));
      setSelectedPosts(new Set()); // Clear selected posts
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบโพสต์:", error);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
  };

  const handleSave = async (updatedPost) => {
    try {
      const response = await axios.put('/api/getdata', { id: updatedPost._id, ...updatedPost });
      setPosts(posts.map(post => (post._id === updatedPost._id ? response.data : post)));
      handleModalClose();
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตโพสต์:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">จัดการกิจกรรม</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add new</button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 w-1/12"></th>
              <th className="px-4 py-2 w-1/6">ชื่อผู้ใช้</th>
              <th className="px-4 py-2 w-1/6">ชื่อกิจกรรม</th>
              <th className="px-4 py-2 w-1/6">เวลา</th>
              <th className="px-4 py-2 w-1/6">สถานที่</th>
              <th className="px-4 py-2 w-1/6">รายละเอียด</th>
              <th className="px-4 py-2 w-1/12">รูปภาพ</th>
              <th className="px-4 py-2 w-1/6">link form</th>
              <th className="px-4 py-2 w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post._id}>
                <td className="border px-4 py-2">
                  <input 
                    type="checkbox" 
                    checked={selectedPosts.has(post._id)} 
                    onChange={() => handleCheckboxChange(post._id)} 
                  />
                </td>
                <td className="border px-4 py-2">{post.username}</td>
                <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{truncateText(post.title, 20)}</td>
                <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{`${post.start_date} ${post.start_time}`}</td>
                <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{post.location}</td>
                <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{truncateText(post.description, 20)}</td>
                <td className="border px-4 py-2">
                  <img src={post.picture} alt={post.title} className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{truncateText(post.link_other, 20)}</td>
                <td className="border px-4 py-2 text-center">
                  <button 
                    className="bg-green-500 text-white px-2 py-1 rounded-lg" 
                    onClick={() => handleEdit(post)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for editing post */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        post={currentPost} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default PostActivity;