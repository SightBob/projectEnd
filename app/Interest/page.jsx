'use client'

import { useState } from 'react';
import axios from 'axios';
import CartInterest from "@/components/CartInterest";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const titleInterest = [
  { name: "อาหาร", img: "food", alt: "ไอคอนอาหารแสดงถึงความสนใจด้านอาหารและการทำอาหาร" },
  { name: "เกม", img: "game", alt: "ไอคอนจอยสติ๊กแสดงถึงความสนใจด้านเกมและวิดีโอเกม" },
  { name: "ชมรมนักศึกษา", img: "club", alt: "ไอคอนกลุ่มคนแสดงถึงกิจกรรมชมรมนักศึกษา" },
  { name: "กีฬา", img: "sport", alt: "ไอคอนอุปกรณ์กีฬาแสดงถึงความสนใจด้านกีฬาและการออกกำลังกาย" },
  { name: "การศึกษา", img: "study", alt: "ไอคอนหนังสือหรือหมวกบัณฑิตแสดงถึงความสนใจด้านการศึกษาและวิชาการ" },
  { name: "ท่องเที่ยว", img: "travel", alt: "ไอคอนกระเป๋าเดินทางหรือลูกโลกแสดงถึงความสนใจด้านการท่องเที่ยว" },
  { name: "ทุนการศึกษา", img: "scholarships", alt: "ไอคอนทุนการศึกษา" },
  { name: "คอนเสิร์ต", img: "concert", alt: "ไอคอนคอนเสิร์ต" },
];

const Page = () => {
  const router = useRouter();
  const { data: session, update} = useSession();
  const [isLoading, setIsLoading] = useState(false); // เพิ่ม state สำหรับ loading

  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  // console.log("session: ", session);
  
  const saveInterests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/interest', { 
        uuid: session.user.uuid, 
        interests: selectedInterests 
      });
    
      console.log("response.status: ", response.status);
      
      if (response.status === 200) {
        await update({
          ...session,
          user: {
            ...session.user,
            verify_categories: true
          }
        });
        
        router.push('/');
      }
      router.push('/');
    
    } catch (error) {
      console.error('Error saving interests:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  }; // เพิ่ม parenthesis ปิด function

  return (
    <div className="min-h-[calc(100vh_-_8rem)] w-full pb-[3rem]"> 
      <div className="max-w-[560px] max-sm:w-[80%] mx-auto relative flex items-center justify-center">
        <h2 className="text-center text-3xl">สิ่งที่คุณสนใจ</h2>
        <div onClick={saveInterests} className="text-gray-400 absolute right-0 cursor-pointer">ข้าม</div>
      </div>
      <div className="flex justify-center w-fit max-sm:w-[90%] mx-auto mt-4">
        <div className="grid grid-cols-4 gap-3 max-sm:grid-cols-2">
          {titleInterest.map((interest, index) => (
            <CartInterest 
              key={index} 
              title={interest.name} 
              name_img={interest.img}
              alt_img={interest.alt}
              isSelected={selectedInterests.includes(interest.name)}
              onClick={() => toggleInterest(interest.name)}
            />
          ))}
        </div>
      </div>
      <div 
        className={`bg-[#FD8D64] px-12 mt-4 py-2 rounded-md w-fit mx-auto text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={!isLoading ? saveInterests : undefined}>
        <p>{isLoading ? 'กำลังบันทึก...' : 'ถัดไป'}</p>
      </div>
    </div>
  );
};

export default Page;