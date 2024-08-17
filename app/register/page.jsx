'use client'

import React, { useState } from 'react';

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

  const handleFacultyChange = (e) => {
    const faculty = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      faculty: faculty,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
    }
  };

  return (
    <div className="bg-white max-h-[calc(100%_-_8rem)] w-full pt-6 pb-8">
      <h2 className="text-3xl text-center">สมัครสมาชิก</h2>
      <form onSubmit={handleSubmit} className="mx-auto flex flex-col items-center">
        <div className="flex justify-center space-x-8 mt-8 max-[666px]:flex-col max-[666px]:space-x-0">
          <div className="flex flex-col w-[300px]">
            <div className="flex justify-between items-center">
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
            
            <div className="flex justify-between items-center">
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
          
          <div className="flex justify-between items-center">
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
          
          <div className="flex justify-between items-center">
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
            
          <div className="flex justify-between items-center">
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
          
          <div className="flex justify-between items-center">
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
            
            <div className="flex justify-between items-center">
            <label className="mt-4" htmlFor="faculty">คณะ</label>
            {errors.faculty && <span className="text-red-500">{errors.faculty}</span>}
            </div>
          
            <div className="relative">
              <select
                id="faculty"
                className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full appearance-none"
                value={formData.faculty}
                onChange={handleFacultyChange}
                style={{ direction: 'rtl' }}
              >
                <option value="" style={{ direction: 'ltr' }}>เลือกคณะ</option>
                {Object.keys(faculties).map((faculty) => (
                  <option key={faculty} value={faculty} style={{ direction: 'ltr' }}>
                    {faculty}
                  </option>
                ))}
              </select>
             
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>

  
            <div className="flex justify-between items-center">
            <label className="mt-4" htmlFor="major">สาขาวิชา</label>
            {errors.major && <span className="text-red-500">{errors.major}</span>}
            </div>
         
            <div className="relative">
              <select
                id="major"
                className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full appearance-none"
                value={formData.major}
                onChange={handleChange}
                disabled={!formData.faculty}
                style={{ direction: 'rtl' }}
              >
                <option value="" style={{ direction: 'ltr' }}>เลือกสาขาวิชา</option>
                {formData.faculty &&
                  faculties[formData.faculty].map((major) => (
                    <option key={major} value={major} style={{ direction: 'ltr' }}>
                      {major}
                    </option>
                  ))}
              </select>
              
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
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