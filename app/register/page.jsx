'use client'

import React, { useState } from 'react';
import CustomDropdown from '@/components/CustomDropdown';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'
// import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';

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

  const Router = useRouter();
  
  // const { data: session } = useSession();
  // if(session) redirect('/');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    faculty: '',
    major: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleFacultyChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      faculty: value,
      major: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'กรุณากรอกชื่อผู้ใช้';
    if (!formData.email) newErrors.email = 'กรุณากรอกอีเมล';
    if (!formData.password) newErrors.password = 'กรุณากรอกรหัสผ่าน';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    if (!formData.firstname) newErrors.firstname = 'กรุณากรอกชื่อจริง';
    if (!formData.lastname) newErrors.lastname = 'กรุณากรอกนามสกุล';
    if (!formData.faculty) newErrors.faculty = 'กรุณาเลือกคณะ';
    if (!formData.major) newErrors.major = 'กรุณาเลือกสาขาวิชา';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
      
      try {
        const resUser = await axios.post('/api/auth/register', formData);

        if (resUser.status === 201 && resUser.data.newUser) {
          const result = await signIn('credentials', {
            id: resUser.data.newUser._id,
            username: formData.username,
            password: formData.password,
            redirect: false
          });
          if (result.ok) {
             Router.push('/interest');
          } else {
            setErrors(prev => ({ ...prev, general: 'เข้าสู่ระบบไม่สำเร็จหลังจากลงทะเบียน กรุณาลองใหม่อีกครั้ง' }));
          }
        } else {
          setErrors(prev => ({ ...prev, general: 'การลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' }));
        }

      } catch (error) {
        if (error.response?.status === 409) {
          if (error.response.data.field === 'email') {
            setErrors(prev => ({ ...prev, email: 'อีเมลนี้มีอยู่ในระบบแล้ว' }));
          }
            if (error.response.data.field === 'username') {
            setErrors(prev => ({ ...prev, username: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' }));
          }
        } else {
          setErrors(prev => ({ ...prev, general: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' }));
        }
      }

    }
  };

  return (
    <div className="bg-white max-h-[calc(100%_-_8rem)] w-full pt-6 pb-8">
      <h2 className="text-3xl text-center">สมัครสมาชิก</h2>
      <form onSubmit={handleSubmit} className="mx-auto flex flex-col items-center">
        <div className="flex justify-center space-x-8 mt-8 max-[666px]:flex-col max-[666px]:space-x-0">
          <div className="flex flex-col w-[300px]">
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="username">ชื่อผู้ใช้</label>
              {errors.username && <span className="text-red-500">{errors.username}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="email">อีเมล</label>
              {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="password">รหัสผ่าน</label>
              {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
          
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col w-[300px]">
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="firstname">ชื่อจริง</label>
              {errors.firstname && <span className="text-red-500">{errors.firstname}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="text"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="lastname">นามสกุล</label>
              {errors.lastname && <span className="text-red-500">{errors.lastname}</span>}
            </div>
            <input
              className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full"
              type="text"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
            
            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="faculty">คณะ</label>
              {errors.faculty && <span className="text-red-500">{errors.faculty}</span>}
            </div>
            <CustomDropdown
              options={Object.keys(faculties)}
              value={formData.faculty}
              onChange={handleFacultyChange}
              placeholder="เลือกคณะ"
            />

            <div className="flex justify-between items-end">
              <label className="mt-4" htmlFor="major">สาขาวิชา</label>
              {errors.major && <span className="text-red-500">{errors.major}</span>}
            </div>
            <CustomDropdown
              options={formData.faculty ? faculties[formData.faculty] : []}
              value={formData.major}
              onChange={(value) => handleChange({ target: { id: 'major', value } })}
              placeholder="เลือกสาขาวิชา"
            />
          </div>
        </div>

        <input
          type="submit"
          className="mt-8 bg-[#FD8D64] w-[40%] min-w-[400px] max-sm:w-[80%] max-sm:min-w-[300px] text-white py-3 rounded-md"
          value="สมัครสมาชิก"
        />
      </form>
    </div>
  );
};

export default Page;