'use client'

import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Page = ({}) => {
    const { data: session} = useSession();

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
        tags: []
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', { ...formData, tags, uuid: session.user.uuid });
        const res = await axios.post('/api/post/', { ...formData, tags, uuid: session.user.uuid } )
        console.log(res.data)
    };

    return (
        <div className="max-h-screen bg-gray-100 ">
            <div className="container flex justify-between space-x-5 max-md:flex-col max-md:space-x-0">
                <div className="min-w-[300px] h-full space-y-3 max-md:grid max-md:grid-cols-2 max-sm:grid-cols-1 max-md:gap-2 max-md:space-y-0">
                    <div className="w-full py-3 rounded-md bg-[#E6AF2E] text-center cursor-pointer max-md:col-span-1">
                        <h2 className="text-black font-semibold">เพิ่มกิจกรรม</h2>
                    </div>
                    <div className="w-full py-3 rounded-md bg-[#FADF63] text-center cursor-pointer max-md:col-span-1">
                        <h2 className="text-black font-semibold">เปิดรับสมัครสมาชิก</h2>
                    </div>
                    <div className="w-full py-3 rounded-md bg-[#FADF63] text-center cursor-pointer max-md:col-span-1">
                        <h2 className="text-black font-semibold">กิจกรรมของฉัน</h2>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full bg-white p-3 rounded-lg shadow-md max-md:mt-3">
                    <div className="flex items-center space-x-4 max-[500px]:flex-col max-[500px]:space-x-0">
                        <div className="mb-4 w-2/4 max-[500px]:w-full">
                            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">หัวเรื่อง</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="mb-4 w-2/4 max-[500px]:w-full">
                            <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">สถานที่</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                  
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

                    <button type="submit" className="bg-green-500 text-white px-14 py-2 rounded-md">ยืนยัน</button>
                </form>
            </div>
        </div>
    );
}

export default Page;
