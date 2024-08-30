'use client'

import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Page = ({}) => {

    const { data: session} = useSession();

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: null,
        additionalLink: '',
        tags: []
    });
    
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: files ? files[0] : value
        }));
    };

    const handleAddTag = () => {
        if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputChange = (e) => {
        setCurrentTag(e.target.value);
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, tags });
        const res = await axios.post('/api/post/', { ...formData, tags, uuid: session.user.uuid } )

        console.log(res.data)
    };

    return (
        <div className="max-h-screen bg-gray-100 ">
            <div className="container flex justify-between space-x-5">
                <div className="min-w-[300px] h-full space-y-3">
                    <div className="w-full py-3 rounded-md bg-[#E6AF2E] text-center cursor-pointer">
                        <h2 className="text-black font-semibold">เพิ่มกิจกรรม</h2>
                    </div>
                    <div className="w-full py-3 rounded-md bg-[#FADF63] text-center cursor-pointer">
                        <h2 className="text-black font-semibold">เปิดรับสมัครสมาชิก</h2>
                    </div>
                    <div className="w-full py-3 rounded-md bg-[#FADF63] text-center cursor-pointer">
                        <h2 className="text-black font-semibold">กิจกรรมของฉัน</h2>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full bg-white p-3 rounded-lg shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="mb-4 w-2/4">
                            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">หัวเรื่อง</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4 w-2/4">
                            <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">วันที่</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="mb-4 w-2/4">
                            <label htmlFor="time" className="block text-gray-700 font-semibold mb-2">เวลา</label>
                            <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4 w-2/4">
                            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">สถานที่</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="mb-0">
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
                        <div className="flex">
                            <input
                                type="text"
                                id="tags"
                                value={currentTag}
                                onChange={handleTagInputChange}
                                onKeyDown={handleTagInputKeyDown}
                                className="flex-grow px-3 py-2 border rounded-l-md"
                                placeholder="Add a tag"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">อัปโหลดภาพ</label>
                        <input type="file" id="image" name="image" onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" accept="image/*" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="additionalLink" className="block text-gray-700 font-semibold mb-2">ลิ้งรายละเอียดเพิ่มเติม <span className='font-light'>(แปลงลิ้งเป็นภาพ Qr code ให้ผู้สนใจแสกน)</span></label>
                        <input type="url" id="additionalLink" name="additionalLink" value={formData.additionalLink} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-14 py-2 rounded-md">ยืนยัน</button>
                </form>
            </div>
        </div>
    );
}

export default Page;