'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EditEvent = ({ params }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
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
        member: 'no'
    });

    const availableTags = ['อาหาร', 'เกม', 'ชมรมนักศึกษา', 'กีฬา', 'การศึกษา', 'ท่องเที่ยว'];
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`/api/data/PostId?id=${params.id}`);
                const eventData = res.data.post.getPost;
                console.log("eventData: ", eventData.title)
                if (eventData) {
                    setFormData({
                        title: eventData.title || '',
                        start_date: eventData.start_date || '',
                        start_time: eventData.start_time || '',
                        end_date: eventData.end_date || '',
                        end_time: eventData.end_time || '',
                        location: eventData.location || '',
                        description: eventData.description || '',
                        image: eventData.picture || null,
                        additionalLink: eventData.link_other || '',
                        tags: eventData.category || [],
                        maxParticipants: eventData.maxParticipants || '',
                        member: eventData.member || 'no'
                    });
                    console.log("eventData: ", eventData);
                } else {
                    console.log("No event data received");
                }
            } catch (error) {
                console.log("Error fetching event data: ", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (params.id) {
            fetchEventData();
        }
    }, [params.id]);

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (name === 'image' && files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prevState => ({
                    ...prevState,
                    image: reader.result 
                }));
            };
            reader.readAsDataURL(files[0]);
        } else if (type === 'checkbox') {
            setFormData(prevState => ({
                ...prevState,
                [name]: checked ? 'yes' : 'no'
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleAddTag = (e) => {
        const selectedTag = e.target.value;
        if (selectedTag !== '' && !formData.tags.includes(selectedTag)) {
            setFormData(prevState => ({
                ...prevState,
                tags: [...prevState.tags, selectedTag]
            }));
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prevState => ({
            ...prevState,
            tags: prevState.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const updatedData = {
            title: formData.title,
            start_date: formData.start_date,
            start_time: formData.start_time,
            end_date: formData.end_date,
            end_time: formData.end_time,
            location: formData.location,
            description: formData.description,
            picture: formData.image,
            link_other: formData.additionalLink,
            category: formData.tags,
            maxParticipants: formData.maxParticipants,
            member: formData.member
        };
    
        console.log("Data being sent to API:", updatedData);
    
        try {
            const res = await axios.put(`/api/data/PostId?id=${params.id}`, updatedData);
            console.log("Response from API:", res.data);
            if (res.status === 200) {
                alert('อัพเดทกิจกรรมสำเร็จ!');
                // router.push('/myevents');
            }
        } catch (error) {
            console.error("Error updating event: ", error);
            console.log("Error response:", error.response?.data);
            alert('เกิดข้อผิดพลาดในการอัพเดทกิจกรรม');
        }
    };

    if (!session?.user?.role) {
        return (
            <div className="text-center py-10 relative top-0 left-0 right-0 bottom-0 bg-gray-300 min-h-[calc(100vh_-_8rem)] flex justify-center items-center">
                <div className="max-w-[350px] h-[400px] w-full bg-white flex flex-col items-center justify-center rounded-md">
                    <div className="rounded-full overflow-hidden">
                        <Image 
                            src="/assets/img_main/profile.png" 
                            layout="responsive"
                            width={250} 
                            height={250} 
                            alt="Profile picture"
                        />
                    </div>
                    <h2 className='mt-8'>กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้</h2>
                    <button onClick={() => router.push('/login')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                        ไปยังหน้าเข้าสู่ระบบ
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">แก้ไขกิจกรรม</h1>
                <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">หัวเรื่อง</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">สถานที่</label>
                        <input type="text" id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                    </div>
                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label htmlFor="start_date" className="block text-gray-700 font-semibold mb-2">วันที่ (เริ่มงาน)</label>
                            <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="start_time" className="block text-gray-700 font-semibold mb-2">เวลา (เริ่มงาน)</label>
                            <input type="time" id="start_time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <label htmlFor="end_date" className="block text-gray-700 font-semibold mb-2">วันที่ (จบงาน)</label>
                            <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
                        </div>
                        <div className="w-1/2">
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
                            {formData.tags.map((tag, index) => (
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
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">อัปโหลดภาพ</label>
                        <input type="file" id="image" name="image" onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" accept="image/*" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="additionalLink" className="block text-gray-700 font-semibold mb-2">ลิ้งรายละเอียดเพิ่มเติม <span className='font-light'>(แปลงลิ้งเป็นภาพ Qr code ให้ผู้สนใจแสกน)</span></label>
                        <input type="url" id="additionalLink" name="additionalLink" value={formData.additionalLink} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="member"
                                checked={formData.member === "yes"}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <span className="text-gray-700">เปิดรับสมาชิก</span>
                        </label>
                    </div>
                    {formData.member === "yes" && (
                        <div className="mb-4">
                            <label htmlFor="maxParticipants" className="block text-gray-700 font-semibold mb-2">จำนวนสมาชิกสูงสุด</label>
                            <input 
                                type="number" 
                                id="maxParticipants" 
                                name="maxParticipants" 
                                value={formData.maxParticipants} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border rounded-md" 
                                min="1"
                                required={formData.member === "yes"}
                            />
                        </div>
                    )}
                    <button type="submit" className="bg-green-500 text-white px-14 py-2 rounded-md w-full">อัพเดทกิจกรรม</button>
                </form>
            </div>
        </div>
    );
}

export default EditEvent;