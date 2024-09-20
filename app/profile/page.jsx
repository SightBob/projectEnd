'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import ProfileDropdown from '@/components/ProfileDropdown'; // Import your dropdown component



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

const Page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    faculty: '',
    major: '',
    username: '',
    profilePicture: '',
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

  const handleFacultyChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      faculty: value,
      major: '' // Reset major when faculty changes
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: reader.result // ใช้ base64 string
        }));
      };
      reader.readAsDataURL(file); // แปลงไฟล์เป็น base64 string
    }
  };
  

  const handleEditToggle = () => {
    if (isEditing) {
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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl relative mb-56">
        {/* Cover Image */}
        <div className="relative w-full h-48">
          <Image
            src="/assets/img_main/cover-cat.png" 
            alt="Cover Photo"
            layout="fill"
            className="object-cover rounded-t-lg"
          />
        </div>

        {/* Profile Header */}
        <div className="relative -mt-16 flex flex-col items-start mb-6 left-3 space-y-2">
          <div className="flex flex-row items-center space-x-4">
            <div className="w-32 h-32 relative z-10">
              <Image
                src={formData.profilePicture || "/assets/img_main/Profile-cat.png"}
                alt="Profile"
                layout="fill"
                className="rounded-full object-cover border-4 border-white"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Image src="/assets/img_main/edit.png" alt="Edit Icon" width={24} height={24} />
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
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="text-xl font-semibold border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h2 className="text-xl font-semibold">{formData.username}</h2>
                )}
                <Image
                  src="/assets/img_main/edit.png"
                  alt="Edit Icon"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                  onClick={handleEditToggle}
                />
              </div>
              <p className="text-gray-500">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-2 gap-4 mt-12 pl-16">
          {['firstname', 'lastname', 'email', 'gender'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700">
                {field === 'firstname' ? 'ชื่อจริง' : 
                 field === 'lastname' ? 'นามสกุล' : 
                 field === 'email' ? 'อีเมล' : 
                 'เพศ'}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`mt-2 px-2 border rounded-md max-w-[325px] py-2 w-full ${isEditing ? 'bg-white' : 'bg-gray-100'}`}
                disabled={!isEditing}
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700">คณะ</label>
            <ProfileDropdown
              options={Object.keys(faculties)}
              value={formData.faculty}
              onChange={handleFacultyChange}
              placeholder="เลือกคณะ"
              disabled={!isEditing}
              className={`mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
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
              className={`mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full ${isEditing ? 'bg-white' : 'bg-gray-200'}`}
            />
          </div>
        </div>
        
        {/* Edit Button */}
        <div className="mt-5 flex justify-end">
        <button 
            className={`px-4 py-2 rounded-md text-white ${isEditing ? 'bg-green-500' : 'bg-blue-500'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;