'use client'

import { useState } from 'react';
import axios from 'axios';
import CartInterest from "@/components/CartInterest";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const titleInterest = [
  { name: "อาหาร", img: "food", alt: "ไอคอนอาหารแสดงถึงความสนใจด้านอาหารและการทำอาหาร" },
  { name: "เกม", img: "game", alt: "ไอคอนจอยสติ๊กแสดงถึงความสนใจด้านเกมและวิดีโอเกม" },
  { name: "ชมรมนักศึกษา", img: "club", alt: "ไอคอนกลุ่มคนแสดงถึงกิจกรรมชมรมนักศึกษา" },
  { name: "กีฬา", img: "sport", alt: "ไอคอนอุปกรณ์กีฬาแสดงถึงความสนใจด้านกีฬาและการออกกำลังกาย" },
  { name: "การศึกษา", img: "study", alt: "ไอคอนหนังสือหรือหมวกบัณฑิตแสดงถึงความสนใจด้านการศึกษาและวิชาการ" },
  { name: "ท่องเที่ยว", img: "travel", alt: "ไอคอนกระเป๋าเดินทางหรือลูกโลกแสดงถึงความสนใจด้านการท่องเที่ยว" },
];

const Page = () => {
  const router = useRouter();
  const { data: session} = useSession();
  // console.log("interest: ", session.user.uuid);

  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const saveInterests = async () => {
    try {
      const response = await axios.post('/api/interest', { uuid: session.user.uuid ,interests: selectedInterests });
      console.log('Interests saved:', response.data);

      if(response.status === 200){
        router.push('/');
      }
    } catch (error) {
      console.error('Error saving interests:', error);

    }
  };

  return (
    <div className="min-h-[calc(100vh_-_8rem)] w-full pb-[3rem]"> 
      <div className="max-w-[560px] max-sm:w-[80%] mx-auto relative flex items-center justify-center">
        <h2 className="text-center text-3xl">สิ่งที่คุณสนใจ</h2>
        <Link href="/" className="text-gray-400 absolute right-0">ข้าม</Link>
      </div>
      <div className="flex justify-center w-fit max-sm:w-[90%] mx-auto mt-4">
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
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
        className="bg-[#FD8D64] px-12 mt-4 py-2 rounded-md w-fit mx-auto text-white cursor-pointer"
        onClick={saveInterests}
      >
        <p>ถัดไป</p>
      </div>
    </div>
  );
};

export default Page;