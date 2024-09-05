
"use client";

import Image from 'next/image';
import Link from 'next/link';
import CalendarComponent from '@/components/Calendar'; // ตรวจสอบว่าคุณมีคอมโพเนนต์นี้

import { useState } from 'react';

const EventDetail = () => {

  const user = {
    id: 'user123',
    name: 'สมชาย สมชาย',
    postTime: 'วันที่ 1 กันยายน 2567 เวลา 10:30 น.'
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Event Detail Section */}
        <div className="flex-1">
          <h1 className="text-orange-400 text-3xl font-bold mb-4">เปิดโลกชวนชมรม</h1>
          
          {/* Cover Image */}
          <div className="relative w-full h-[450px] mb-4 ">
            <Image 
              className="object-fill rounded-lg" 
              layout="fill" 
              objectFit="fill" 
              alt="Event Cover" 
              // src="https://oreg.rmutt.ac.th/wp-content/uploads/2019/01/40275-Converted-01.png" 
              src="/assets/img_inter/club.png "
            />
          </div>

          {/* Organizer Profile */}
          <div className="flex items-center mb-4">
            <div className="relative w-16 h-16 mr-4">
              <Image 
                className="rounded-full border-4 border-white object-cover"
                layout="fill" 
                objectFit="cover" 
                alt="Organizer Profile" 
                src="/assets/img_main/Profile-cat.png"
              />
            </div>
            <div>
              <p className="text-xl font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">ID: {user.id}</p>
              <p className="text-sm text-gray-500">{user.postTime}</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold">วันที่จัดกิจกรรม:</p>
            <p>17-26 กรกฏาคม 2567</p>
            <p className="text-lg font-semibold mt-2">สถานที่จัดกิจกรรม:</p>
            <p>ลานอเนกประสงค์</p>
            <p className="text-lg font-semibold mt-2">รายละเอียด:</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta cupiditate ipsa praesentium distinctio provident nisi odio corporis obcaecati quaerat illo delectus ad placeat culpa ratione totam, dolorum rerum magni debitis!</p>
          </div>

          {/* Back Link */}
          <div className="mt-4">
            <Link href="/" className="text-blue-500 underline">Back to Event List</Link>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="w-[350px] ml-4">
          <div className="w-full">
          <CalendarComponent onDateChange={setSelectedDate} selectedDate={selectedDate} />
          </div>
          
          {/* QR Code Section */}
          <div className="mt-10 text-center">
            <p className="text-lg font-semibold mb-2 ">สมัครเข้าร่วมได้ที่นี่</p>
            <Image 
              src="/assets/img_inter/QR.png" 
              alt="QR Code" 
              width={200} 
              height={200} 
              className="mx-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
