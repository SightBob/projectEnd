'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ProfileDropdown from '@/components/ProfileDropdown'; 
import LoadingSpinner from '@/components/LoadingSpinner';
import CartEvent from '@/components/CartEvent';

const faculties = {
  "สำนักวิชาวิทยาศาสตร์": [
    "สาขาวิชาเคมี",
    "สาขาวิชาคณิตศาสตร์",
    "สาขาวิชาชีววิทยา",
    "สาขาวิชาฟิสิกส์",
    "สาขาวิชาการรับรู้จากระยะไกล",
    "สาขาวิชาเทคโนโลยีเลเซอร์และโฟตอนนิกส์",
    "สาขาวิชาจุลชีววิทยา",
    "สาขาวิชาชีวเคมี",
    "สาขาวิชาวิทยาศาสตร์การกีฬา",
    "สาขาวิชากายวิภาคศาสตร์",
    "สาขาวิชาสรีรวิทยา",
    "สาขาวิชาปรสิตวิทยา",
    "สาขาวิชาเภสัชวิทยา"
  ],
  "สำนักวิชาเทคโนโลยีสังคม": [
    "สาขาวิชาศึกษาทั่วไป",
    "สาขาวิชาภาษาต่างประเทศ",
    "สาขาวิชาเทคโนโลยีสารสนเทศ",
    "สาขาวิชาเทคโนโลยีการจัดการ"
  ],
  "สำนักวิชาเทคโนโลยีการเกษตร": [
    "สาขาวิชาเทคโนโลยีการผลิตพืช",
    "สาขาวิชาเทคโนโลยีการผลิตสัตว์",
    "สาขาวิชาเทคโนโลยีชีวภาพ",
    "สาขาวิชาเทคโนโลยีอาหาร"
  ],
  "สำนักวิชาแพทยศาสตร์": [
    "สาขาวิชาอาชีวอนามัยและความปลอดภัย",
    "สาขาวิชาอนามัยสิ่งแวดล้อม",
    "แพทยศาสตร์"
  ],
  "สำนักวิชาพยาบาลศาสตร์": ["พยาบาลศาสตร์"],
  "สำนักวิชาวิศวกรรมศาสตร์": [
    "สาขาวิชาวิศวกรรมการผลิต",
    "สาขาวิชาวิศวกรรมเกษตร",
    "สาขาวิชาวิศวกรรมขนส่ง",
    "สาขาวิชาวิศวกรรมคอมพิวเตอร์",
    "สาขาวิชาวิศวกรรมเคมี",
    "สาขาวิชาวิศวกรรมเครื่องกล",
    "สาขาวิชาวิศวกรรมเซรามิก",
    "สาขาวิชาวิศวกรรมโทรคมนาคม",
    "สาขาวิชาวิศวกรรมพอลิเมอร์",
    "สาขาวิชาวิศวกรรมไฟฟ้า",
    "สาขาวิชาวิศวกรรมโยธา",
    "สาขาวิชาวิศวกรรมโลหการ",
    "สาขาวิชาวิศวกรรมสิ่งแวดล้อม",
    "สาขาวิชาวิศวกรรมอุตสาหการ",
    "สาขาวิชาเทคโนโลยีธรณี",
    "สาขาวิชาวิศวกรรมอิเล็กทรอนิกส์"
  ],
  "สำนักวิชาทันตแพทยศาสตร์": ["ทันตแพทยศาสตร์"],
  "สำนักวิชาสาธารณสุขศาสตร์": ["สาธารณสุขศาสตร์"],
  "สำนักวิชาศาสตร์และศิลป์ดิจิทัล": ["ศาสตร์และศิลป์ดิจิทัล"]
};

const Gender = ["ชาย", "หญิง", "ไม่ระบุ"];

const Interrest = ["เกม", "กีฬา", "อาหาร", "ท่องเที่ยว", "สัตว์เลี้ยง", "การศึกษา", "ชมรมนักศึกษา","ทุนการศึกษา","คอนเสิร์ต"];

const Page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState('ProfileView');
  const [userActivities, setUserActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    faculty: '',
    major: '',
    username: '',
    profilePicture: '',
    profileCoverPicture: '',
    preferred_categories: []
  });

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchUserData() {
        try {
          const response = await fetch(`/api/profile?uid=${session.user.uuid}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);
            setFormData(data); // Initialize form data
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      fetchUserData();
      fetchUserActivity();
    }
  }, [status, session]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const fetchUserActivity = async (userId) => {
    try {
      setIsLoading(true);
      
      console.log("กำลังเรียก API ด้วย userId:", userId);
      
      // แก้ไข URL ให้ตรงกับ path ที่ถูกต้อง
      const response = await fetch(`/api/data/userActivity?uid=${session.user.uuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user activities');
      }
  
      const data = await response.json();
      setUserActivities(data.events);
      return data.events;
  
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  


  const toggleInterest = (interest) => {
    setFormData((prevData) => {
        console.log('Before update:', prevData.preferred_categories);
        
        const updatedCategories = prevData.preferred_categories.includes(interest)
            ? prevData.preferred_categories.filter(item => item !== interest)
            : [...prevData.preferred_categories, interest];
        
        console.log('Updated preferred_categories:', updatedCategories);
        
        return {
            ...prevData,
            preferred_categories: updatedCategories
        };
    });
};

  const handleFacultyChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      faculty: value,
      major: '' // Reset major when faculty changes
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value, // อัปเดตค่า gender ตามที่เลือก
    }));
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: reader.result 
        }));
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          profileCoverPicture: reader.result 
        }));
      };
      reader.readAsDataURL(file); 
    }
  };
  

  const handleEditToggle = () => {
    if (isEditing) {
      console.log('Form data before saving:มาแล้วนะ', formData);
      async function saveUserData() {
        try {
          const response = await fetch(`/api/profile?uid=${session.user.uuid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          if (response.ok) {
            const updatedData = await response.json();
            setUser(updatedData);
            alert('บันทึกข้อมูลเสร็จสิ้น');
          } else {
            console.error('Failed to save user data');
          }
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      }
      saveUserData();
    }
    setIsEditing(!isEditing);
  };
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center w-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative mb-56 h-screen grid place-items-center">
      <LoadingSpinner/>
    </div>
    </div>
    )
    ;
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative mb-56">
        {/* Cover Image */}
        <div className="relative w-full h-48">
          <Image
            src={formData.profileCoverPicture || "/assets/img_main/SUT91.jpg" }
            alt="Cover Photo"
            layout="fill"
            className="object-cover rounded-t-lg"
          />
          {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
                  <label htmlFor="Coverfile-upload" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className='size-8' viewBox="0 0 24 24"><g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m21.28 6.4-9.54 9.54c-.95.95-3.77 1.39-4.4.76-.63-.63-.2-3.45.75-4.4l9.55-9.55a2.58 2.58 0 1 1 3.64 3.65v0Z"/><path d="M11 4H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h11c2.21 0 3-1.8 3-4v-5"/></g></svg>
                  </label>
                  <input
                    id="Coverfile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                  />
                </div>
              )}
        </div>

        {/* Profile Header */}
        <div className="relative -mt-16 flex flex-col items-start mb-2 left-3 space-y-2 ">
          
          <div className="flex flex-row items-center space-x-4">
            <div className="w-32 h-32 relative z-10">
              <Image
                src={formData.profilePicture || "/assets/img_main/usericon.png"}
                alt="Profile"
                layout="fill"
                className="rounded-full object-cover border-4 border-white"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" className='size-8' viewBox="0 0 24 24"><g stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="m21.28 6.4-9.54 9.54c-.95.95-3.77 1.39-4.4.76-.63-.63-.2-3.45.75-4.4l9.55-9.55a2.58 2.58 0 1 1 3.64 3.65v0Z"/><path d="M11 4H6a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h11c2.21 0 3-1.8 3-4v-5"/></g></svg>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <div className="mt-14 flex flex-col justify-center">
              <div className="flex items-center">
                  <h2 className="text-xl font-semibold">{`${formData.firstname} ${formData.lastname}`}</h2>
              </div>
              {/* <p className="text-gray-500">{formatDate(user.createdAt)}</p> */}
            </div>
          </div>
          
        </div>  
        <div className="flex justify-between items-center pr-16 mb-6 max-[750px]:pr-2">
                <div className="bg-transparent  flex space-x-3 pl-16 text-sm font-medium max-[750px]:px-2">
                <p 
              onClick={() => setView('ProfileView')} 
              className={`cursor-pointer ${view === 'ProfileView' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500'}`}
            >
              โปรไฟล์
            </p>
            <p 
              onClick={() => setView('PersonaView')} 
              className={`cursor-pointer ${view === 'PersonaView' ? 'font-bold text-black border-b-2 border-black' : 'text-gray-500'}`}
            >
              ความเป็นส่วนตัว
            </p>
                </div>
                {/* Edit Button */}
                <div className=" justify-end">
                <button 
                    className={`px-4 py-2 rounded-md text-white ${isEditing ? 'bg-green-500' : 'bg-gray-500'}`}
                    onClick={handleEditToggle}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                </div>
        {/* Profile Form */}
        {view === 'ProfileView' && (
        <div id='ProfileView' className="grid grid-cols-2 gap-4 mt-1 pl-16 max-[750px]:px-2 max-[510px]:grid-cols-1">
          {['firstname', 'lastname', 'email'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
              {field === 'firstname' ? 'ชื่อจริง' : 
              field === 'lastname' ? 'นามสกุล' : 
              field === 'email' ? 'อีเมล' : ''}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`mt-2 px-2 border rounded-md py-2 w-full max-[510px]:max-w-full ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div>
              <label className="block text-sm font-medium text-gray-700">เพศ</label>
              <ProfileDropdown
                options={Gender} 
                value={formData.gender}
                onChange={handleGenderChange}
                placeholder="เลือกเพศ"
                disabled={!isEditing}
                className={`mt-2 px-2 border rounded-md py-1 w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
              />
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">คณะ</label>
            <ProfileDropdown
              options={Object.keys(faculties)}
              value={formData.faculty}
              onChange={handleFacultyChange}
              placeholder="เลือกคณะ"
              disabled={!isEditing}
              className={`mt-2 px-2 border rounded-md py-1 w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">สาขา</label>
            <ProfileDropdown
              options={formData.faculty ? faculties[formData.faculty] : []}
              value={formData.major}
              onChange={(value) => handleInputChange({ target: { name: 'major', value } })}
              placeholder="เลือกสาขา"
              disabled={!isEditing}
              className={`mt-2 px-2 border rounded-md py-1 w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
            />
          </div>
        </div>
         )}
        
       {/* PersonaView Form */}
        {view === 'PersonaView' && (
          <div id='PersonaView' className="flex flex-col">
            <div className="grid grid-cols-1 gap-4 mt-1 px-16 max-[510px]:px-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">สิ่งที่สนใจ</label>
                    
                    {/* แสดงเฉพาะหมวดหมู่ที่ผู้ใช้เลือกไว้ในโหมดปกติ */}
                    {!isEditing && (
                        <div className="grid grid-cols-5 gap-3 max-[510px]:grid-cols-2">
                            {formData.preferred_categories.map((item, index) => (
                                <div
                                    key={index}
                                    className="border-2 items-center flex justify-center rounded-lg bg-gray-300"
                                >
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* แสดงรายการทั้งหมดในโหมดแก้ไข */}
                    {isEditing && (
                        <div className="grid grid-cols-5 gap-3 max-[510px]:grid-cols-2">
                            {Interrest.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                      console.log('Clicked interest:', item);
                                      toggleInterest(item);
                                  }}
                                    className={`cursor-pointer border-2 items-center flex justify-center rounded-lg ${
                                        formData.preferred_categories.includes(item) ? 'bg-green-400' : 'bg-gray-400'
                                    }`}
                                >
                                    <p>{item}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
          </div>
          <div className="px-16 max-[510px]:px-2 mt-2">
                {/* Acivity Join */}
        <label className="block text-sm font-medium text-gray-700">กิจกรรมที่เข้าร่วม</label>
        <div className="w-full grid grid-cols-3 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
          {isLoading ? (
            <div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
              <LoadingSpinner/>
            </div>
          ) : userActivities.length > 0 ? (
            userActivities.map((item, index) => (
              <CartEvent key={index} id={item._id} img={item.picture} title={item.title} start_date={item.start_date} start_time={item.start_time} location={item.location} userId={session?.user?.uuid} favorites={item.favorites} views={item.views} />
            ))
          ) : (
            <p>ไม่พบกิจกรรมที่ผู้ใช้เข้าร่วม</p>
          )}
        </div>
        </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Page;