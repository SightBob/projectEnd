"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '@/components/Modal';
import PostFormModal from '@/components/PostFormModal';
import { useSession } from 'next-auth/react';

const PostActivity = () => {

  const { data: session} = useSession();
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddNewModalOpen, setIsAddNewModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/getdata');
        const sortedPosts = response.data.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term
// Filter posts based on search term
const filteredPosts = posts.filter(post => 
  post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  post.username.toLowerCase().includes(searchTerm.toLowerCase())
);

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
    if (selectedPosts.size === 0) {
      alert("Please select posts to delete");
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete the selected posts?");
    if (!confirmDelete) {
      return;
    }

    try {
      await Promise.all([...selectedPosts].map(id => 
        axios.delete('/api/getdata', { data: { id } })
      ));
      setPosts(posts.filter(post => !selectedPosts.has(post._id)));
      setSelectedPosts(new Set());
    } catch (error) {
      console.error("Error deleting posts:", error);
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
      if (currentPost) {
        const response = await axios.put('/api/getdata', { id: updatedPost._id, ...updatedPost });
        setPosts(posts.map(post => (post._id === updatedPost._id ? response.data : post)));
      } else {
        const response = await axios.post('/api/getdata', updatedPost);
        setPosts([response.data, ...posts]);
      }
      handleModalClose();
    } catch (error) {
      console.error("Error updating or creating post:", error);
    }
  };

  const handleAddNewClick = () => {
    setIsAddNewModalOpen(true);
  };

  const handleAddNewModalClose = () => {
    setIsAddNewModalOpen(false);
  };

  const handleAddNewSave = async (newPost) => {
    try {
      const response = await axios.post('/api/getdata', newPost);
      setPosts([response.data, ...posts]);
      handleAddNewModalClose();
    } catch (error) {
      console.error("Error creating new post:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Manage Activities</h1>

      <div className="flex justify-between items-center mb-4">
  <input
    type="text"
    placeholder="Search by Event Name"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-4 py-2 rounded-lg mr-2"
  />
   <div className="flex space-x-2">
  <button onClick={handleAddNewClick} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add New</button>
  <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
</div>
</div>



      <div className="overflow-x-auto bg-white p-6 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 w-1/12"></th>
              <th className="px-4 py-2 w-1/6">Username</th>
              <th className="px-4 py-2 w-1/6">Event Name</th>
              <th className="px-4 py-2 w-1/6">Time</th>
              <th className="px-4 py-2 w-1/6">Location</th>
              <th className="px-4 py-2 w-1/6">Details</th>
              <th className="px-4 py-2 w-1/12">Image</th>
              <th className="px-4 py-2 w-1/6">Link Form</th>
              <th className="px-4 py-2 w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map(post => (
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

        {/* Pagination controls */}
        <div className="flex justify-center mt-4">
          {[...Array(Math.ceil(filteredPosts.length / postsPerPage)).keys()].map(num => (
            <button
              key={num + 1}
              onClick={() => paginate(num + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === num + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {num + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal for editing post */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        post={currentPost} 
        onSave={handleSave} 
      />

      {/* Modal for adding new post */}
      <PostFormModal 
        isOpen={isAddNewModalOpen} 
        onClose={handleAddNewModalClose} 
        onSave={handleAddNewSave} 
        session={session}
      />
    </div>
  );
};

export default PostActivity;
