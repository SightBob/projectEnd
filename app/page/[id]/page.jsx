"use client";

import Image from 'next/image';
import ChatContainer from '@/components/ChatContainer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, addYears } from 'date-fns';
import { th } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';

const EventDetail = ({ params }) => {
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [organizerName, setOrganizerName] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get("/api/data/getId", { 
          params: { id: params.id }
        });
        setEventData(res.data.post);
        setOrganizerName(res.data.organizer); 
        console.log(res.data.post);
      } catch (error) {
        console.error("Error fetching event detail: ", error);
        setError("Failed to load event data");
      }
    };
  
    fetchEventData();
  }, [params.id]);

  const handleClick = () => {
    if (eventData) {
      console.log('Organizer ID:', eventData.organizer_id);
      console.log('ทำงานนะจ๊ะ');
      setSelectedContactId(eventData.organizer_id);
      setShowChat(true);
    }
  };

  function formatThaiDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const buddhistYear = addYears(date, 543);
    
    return format(buddhistYear, "วันที่ d MMMM yyyy เวลา HH:mm 'น.'", { locale: th });
  }

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get("/api/data/PostId", { 
          params: { id: params.id }
        });
        setEventData(res.data.post);
        console.log(res.data.post);
      } catch (error) {
        console.error("Error fetching event detail: ", error);
        setError("Failed to load event data");
      }
    };

    fetchEventData();
  }, [params.id]);

  const [selectedDate, setSelectedDate] = useState(new Date());

  if (error) return <div>Error: {error}</div>;
  if (!eventData) return <LoadingSpinner/>;

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Left Section - 75% */}
        <div className="flex-[3]">
          {/* Event Details Container */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Cover Image */}
            <div className="relative w-full h-[350px] mb-4">
              <Image
                className="object-cover rounded-lg"
                fill
                alt="Event Cover"
                src={eventData.picture || "/default-image.jpg"}
              />
            </div>

          {/* Organizer Profile */}
{/* Organizer Profile */}
<div className="flex items-center mb-4">
  <div className="relative w-16 h-16 mr-4">
    <Image
      className="rounded-full border-4 border-white object-cover"
      fill
      alt="Organizer Profile"
      src="/assets/img_main/Profile-cat.png"
    />
  </div>
  <div className="flex flex-col">
    <div className="flex items-center">
      <p className="text-xl font-semibold">{organizerName || 'Unknown Organizer'}</p>
      <div className='px-3' onClick={handleClick} style={{ cursor: 'pointer' }}>
        <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <g stroke="#1C274C">
            <path strokeWidth="1.5" d="M12 22a10 10 0 1 0-8.96-5.55c.18.36.24.77.14 1.15l-.6 2.23a1.3 1.3 0 0 0 1.6 1.59l2.22-.6c.38-.1.8-.04 1.15.14A9.96 9.96 0 0 0 12 22Z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h0m4 0h0m4 0h0" opacity=".5"/>
          </g>
        </svg>
      </div>
    </div>
    <p className="text-sm text-gray-500">{formatThaiDate(eventData.created_at)}</p>
  </div>
</div>
            

          {/* Event Details */}
<div className="flex">
  <div className="flex-1 ">
    <h1 className="text-2xl font-bold mb-4">{eventData.title}</h1>
    <p className="text-lg font-semibold">วันที่จัดกิจกรรม:</p>
    <p>{formatThaiDate(eventData.start_date)} - {formatThaiDate(eventData.end_date)}</p>
    <p className="text-lg font-semibold mt-2">สถานที่จัดกิจกรรม:</p>
    <p>{eventData.location}</p>
    <p className="text-lg font-semibold mt-2">รายละเอียด:</p>
    <p>{eventData.description}</p>
  </div>

  {/* QR Code and "ดูรายละเอียดเพิ่มเติม" on the Left */}
  <div className="flex flex-col items-start ml-4">
    <div className="mb-4">
      <p className="text-lg font-semibold mb-3">ดูรายละเอียดเพิ่มเติม</p>
      <QRCodeSVG
        className="mx-auto"
        value={eventData.link_other || "https://default-link.com"}
        size={150}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
      />
    </div>
    <button 
      className="bg-orange-400 text-white px-7 py-2 rounded-lg hover:bg-orange-500"
      onClick={() => {
        console.log("เข้าร่วมกิจกรรม");
        // Add logic for joining the event here
      }}
    >
      เข้าร่วมกิจกรรม
    </button>
  </div>
</div>
          </div>
        </div>

        <div className="flex-[1]">
        <div className="bg-white p-6 rounded-lg shadow-md h-full ml-3">
          </div>
        </div>
      </div>

      {showChat && (
        <div className="fixed bottom-4 right-4 z-50">
          <ChatContainer 
            onClose={() => setShowChat(false)} 
            selectedContactId={selectedContactId}
          />
        </div>
      )}
    </div>
  );
};

export default EventDetail;