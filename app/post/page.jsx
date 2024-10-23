'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import CartEvent from '@/components/CartEvent';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [member, setMember] = useState("no");
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
        maxParticipants: ''
    });

    const hanldeChangeMember = (e) => {
        if (e.target.name === 'type') {
            setMember(e.target.checked ? "yes" : "no");
        }
    }

    const availableTags = ['อาหาร', 'เกม', 'ชมรมนักศึกษา', 'กีฬา', 'การศึกษา', 'ท่องเที่ยว'];

    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [activeSection, setActiveSection] = useState('form');
    const [DataByUserid, setDataByUserid] = useState([]);

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

        const postType = activeSection === 'event' ? 'event' : 'info';

        console.log('Form submitted:', { 
            ...formData, 
            tags, 
            uuid: session?.user?.uuid, 
            type: postType, 
            member: activeSection === 'event' ? "yes" : member,
            maxParticipants: formData.maxParticipants
        });

        const res = await axios.post('/api/post/', {   ...formData, 
            tags, 
            uuid: session?.user?.uuid, 
            type: postType, 
            member: activeSection === 'event' ? "yes" : member,
            maxParticipants: formData.maxParticipants });

        if (res.status === 201) {

            console.log("response post: ", res.data)
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
                maxParticipants: ''
            });
            setTags([]);
            alert('โพสต์สำเร็จแล้ว!');
        }
    };

    const fetchMyData = async () => {
        try {
            const res = await axios.get("/api/data/userId", { params: { Userid: session.user.uuid } });
            console.log("res.data.getPost: ",res.data.getPost);
            setDataByUserid(res.data.getPost);
        } catch (error) {
            console.log("Error fetch my data: ", error);
        }
    }

    useEffect(() => {
        if (activeSection === "posts" && session?.user?.uuid) {
            fetchMyData();
        }
    }, [activeSection, session?.user?.uuid]);

    const handleDelete = (deletedId) => {
        setDataByUserid(prevData => prevData.filter(item => item._id !== deletedId));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {session?.user?.role ? (
            <div className="container flex justify-between space-x-5 max-md:flex-col max-md:space-x-0">
                <div className="min-w-[300px] h-full space-y-3 max-md:grid max-md:grid-cols-2 max-sm:grid-cols-1 max-md:gap-2 max-md:space-y-0">
                    <div 
                        className={`w-full py-3 rounded-md ${activeSection === 'form' ? 'bg-[#E6AF2E]' : 'bg-[#FADF63]'} text-center cursor-pointer max-md:col-span-1`}
                        onClick={() => setActiveSection('form')}
                    >
                        <h2 className="text-black font-semibold">เพิ่มกิจกรรม</h2>
                    </div>
                    <div 
                        className={`w-full py-3 rounded-md ${activeSection === 'event' ? 'bg-[#E6AF2E]' : 'bg-[#FADF63]'} text-center cursor-pointer max-md:col-span-1`}
                        onClick={() => {
                            setActiveSection('event');
                            setMember('no');
                        }}
                    >
                        <h2 className="text-black font-semibold">เพิ่มโพสต์เปิดรับสมาชิก</h2>
                    </div>
                    <div 
                        className={`w-full py-3 rounded-md ${activeSection === 'posts' ? 'bg-[#E6AF2E]' : 'bg-[#FADF63]'} text-center cursor-pointer max-md:col-span-1`}
                        onClick={() => setActiveSection('posts')}
                    >
                        <h2 className="text-black font-semibold">โพสต์ของฉัน</h2>
                    </div>
                </div>

                {activeSection === 'form' && (
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
                            <input type="date" id="start_date" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4 w-2/4">
                            <label htmlFor="start_time" className="block text-gray-700 font-semibold mb-2">เวลา (เริ่มงาน)</label>
                            <input type="time" id="start_time" name="start_time" value={formData.start_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="mb-4 w-2/4">
                            <label htmlFor="end_date" className="block text-gray-700 font-semibold mb-2">วันที่ (จบงาน)</label>
                            <input type="date" id="end_date" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="mb-4 w-2/4">
                            <label htmlFor="end_time" className="block text-gray-700 font-semibold mb-2">เวลา (จบงาน)</label>
                            <input type="time" id="end_time" name="end_time" value={formData.end_time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                        </div>
                    </div>
                    <div className="mb-0">
                        <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">รายละเอียด</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
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

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="type"
                                onChange={hanldeChangeMember}
                                className="mr-2"
                            />
                            <span className="text-gray-700">เปิดรับสมาชิก</span>
                        </label>
                    </div>

                    {member === "yes" && (
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
                                required={member === "yes"}
                            />
                        </div>
                    )}
    
                    <button type="submit" className="bg-green-500 text-white px-14 py-2 rounded-md">ยืนยัน</button>
                </form>
                )}
                {activeSection === 'event' && (
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
                            <label htmlFor="maxParticipants" className="block text-gray-700 font-semibold mb-2">จำนวนสมาชิกสูงสุด</label>
                            <input 
                                type="number" 
                                id="maxParticipants" 
                                name="maxParticipants" 
                                value={formData.maxParticipants} 
                                onChange={handleInputChange} 
                                className="w-full px-3 py-2 border rounded-md" 
                                min="1"
                                required={member === "yes"}
                            />
                        </div>

                     <div className="mb-4">
                         <label htmlFor="additionalLink" className="block text-gray-700 font-semibold mb-2">ลิ้งรายละเอียดเพิ่มเติม <span className='font-light'>(แปลงลิ้งเป็นภาพ Qr code ให้ผู้สนใจแสกน)</span></label>
                         <input type="url" id="additionalLink" name="additionalLink" value={formData.additionalLink} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" />
                     </div>
     
                     <button type="submit" className="bg-green-500 text-white px-14 py-2 rounded-md">ยืนยัน</button>
                 </form>
                )}
                
                        {activeSection === 'posts' && (
                <div className="w-full bg-gray-100 p-3 rounded-lg shadow-md max-md:mt-3 min-h-[100vh]">
                    <div className="w-full grid grid-cols-4 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
                    { DataByUserid.length > 0 ? DataByUserid.map((item, key) => (
                        <CartEvent 
                            key={item._id}
                            id={item._id} 
                            img={item.picture} 
                            title={item.title} 
                            start_date={item.start_date} 
                            start_time={item.start_time} 
                            location={item.location} 
                            type="edit" 
                            member={item.member} 
                            maxParticipants={item.maxParticipants} 
                            current_participants={item.current_participants} 
                            userId={session?.user?.uuid} 
                            favorites={item.favorites} 
                            views={item.views}
                            onDelete={handleDelete}
                        />
                    )) : <>
                     <div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
                        ไม่พบโพสต์ของคุณ
                        </div>
                    </>}
                    </div>
                </div>
            )}
            </div>
               ) : (
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
            )}
        </div>
    );
}

export default Page;