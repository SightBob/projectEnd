'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const PostFormModal = ({ isOpen, onClose, session }) => {

  // const { data: session } = useSession();
  console.log("session: ", session);
  const [formData, setFormData] = useState({
    title: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    location: '',
    description: '',
    image: null,
    additionalLink: '',
    tags: [],
    maxParticipants: '',
    member: 'no',
  });

  const availableTags = ['อาหาร', 'เกม', 'ชมรมนักศึกษา', 'กีฬา', 'การศึกษา', 'ท่องเที่ยว'];
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          image: reader.result
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddTag = (e) => {
    const selectedTag = e.target.value;
    if (selectedTag !== '' && !tags.includes(selectedTag)) {
      setTags([...tags, selectedTag]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCheckboxChange = () => {
    setFormData(prevState => ({
      ...prevState,
      member: prevState.member === 'no' ? 'yes' : 'no',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const postType = formData.member === 'yes' ? 'event' : 'info';
    console.log('submit')
    try {
        const res = await axios.post('/api/post', {
            ...formData,
            tags,
            uuid: session?.user?.uuid,
            organizer_id: session?.user?.uuid,
            type: 'info',
        });

        console.log(res.data)
        if (res.status === 201) {
            // Reset form and close modal

            e.target.reset();
            setFormData({
                title: '',
                start_date: '',
                start_time: '',
                end_date: '',
                end_time: '',
                location: '',
                description: '',
                image: null,
                additionalLink: '',
                tags: [],
                maxParticipants: '',
                member: 'no',
            });
            setTags([]);
            alert('โพสต์สำเร็จแล้ว!');
            onClose();
        }
    } catch (error) {
        console.error('Error submitting form:', error.response ? error.response.data : error.message);
        alert('เกิดข้อผิดพลาดในการโพสต์ กรุณาลองใหม่อีกครั้ง');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-3xl max-h-[80vh] overflow-y-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Adsssd New Post</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">หัวเรื่อง</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">สถานที่</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
          </div>
          <div className="flex items-center space-x-4">
            <div className="mb-4 w-2/4">
              <label htmlFor="start_date" className="block text-gray-700 font-semibold mb-2">วันที่ (เริ่มงาน)</label>
              <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4 w-2/4">
              <label htmlFor="start_time" className="block text-gray-700 font-semibold mb-2">เวลา (เริ่มงาน)</label>
              <input type="time" id="start_time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="mb-4 w-2/4">
              <label htmlFor="end_date" className="block text-gray-700 font-semibold mb-2">วันที่ (จบงาน)</label>
              <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
            <div className="mb-4 w-2/4">
              <label htmlFor="end_time" className="block text-gray-700 font-semibold mb-2">เวลา (จบงาน)</label>
              <input type="time" id="end_time" name="end_time" value={formData.end_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">รายละเอียด</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" rows="3" required></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-gray-700 font-semibold mb-2">Tags</label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 text-red-500 font-bold">
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <select onChange={handleAddTag} value={currentTag} className="px-3 py-2 border rounded-md">
              <option value="">Select a tag</option>
              {availableTags.map((tag, index) => (
                <option key={index} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">อัปโหลดภาพ</label>
            <input type="file" id="image" name="image" onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" accept="image/*" />
          </div>
          <div className="mb-4">
            <label htmlFor="additionalLink" className="block text-gray-700 font-semibold mb-2">ลิ้งรายละเอียดเพิ่มเติม <span className='font-light'>(แปลงลิ้งเป็นภาพ Qr code ให้ผู้สนใจแสกน)</span></label>
            <input type="url" id="additionalLink" name="additionalLink" value={formData.additionalLink} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="member" name="member" checked={formData.member === 'yes'} onChange={handleCheckboxChange} className="mr-2" />
            <label htmlFor="member" className="text-gray-700">ต้องการให้ผู้สมัครเข้าร่วม?</label>
          </div>
          {formData.member === 'yes' && (
            <div className="mb-4">
              <label htmlFor="maxParticipants" className="block text-gray-700 font-semibold mb-2">จำนวนผู้เข้าร่วมสูงสุด</label>
              <input type="number" id="maxParticipants" name="maxParticipants" value={formData.maxParticipants} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          )}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">โพสต์</button>
          <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md" onClick={onClose}>ยกเลิก</button>
        </form>
      </div>
    </div>
  );
};

export default PostFormModal;
