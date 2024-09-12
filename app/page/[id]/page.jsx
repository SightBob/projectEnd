"use client";

import Image from 'next/image';
import Link from 'next/link';
import CalendarComponent from '@/components/Calendar';
import ChatContainer from '@/components/ChatContainer';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { format, addYears } from 'date-fns';
import { th } from 'date-fns/locale';

import { QRCodeSVG } from 'qrcode.react';

import LoadingSpinner from '@/components/LoadingSpinner';
const EventDetail = ({ params, contactId }) => {
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showChat, setShowChat] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axios.get("/api/data/getId", { 
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

  if (error) return <div>Error: {error}</div>;
  if (!eventData) return <LoadingSpinner/>;

  return (
    <div className="container mx-auto my-8">
      <div className="flex">
        {/* Event Detail Section */}
        <div className="flex-1">
          <h1 className="text-orange-400 text-3xl font-bold mb-4">{eventData.title}</h1>
          
          {/* Cover Image */}
          <div className="relative w-full h-[450px] mb-4 ">
            <Image 
              className="object-fill rounded-lg" 
              layout="fill" 
              objectFit="cover" 
              alt="Event Cover" 
              src={eventData.picture || "/default-image.jpg"}
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
              <p className="text-xl font-semibold">{eventData.organizer_name || 'Unknown Organizer'}</p>
              <p className="text-sm text-gray-500">{formatThaiDate(eventData.created_at)}</p>
            </div>
            <div className='px-3 ' onClick={handleClick} style={{ cursor: 'pointer' }}>
            <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24"><g stroke="#1C274C"><path stroke-width="1.5" d="M12 22a10 10 0 1 0-8.96-5.55c.18.36.24.77.14 1.15l-.6 2.23a1.3 1.3 0 0 0 1.6 1.59l2.22-.6c.38-.1.8-.04 1.15.14A9.96 9.96 0 0 0 12 22Z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h0m4 0h0m4 0h0" opacity=".5"/></g></svg>
            </div>
          </div>

          

          {/* Event Details */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold">วันที่จัดกิจกรรม:</p>
            <p>{formatThaiDate(eventData.start_date)} - {formatThaiDate(eventData.end_date)}</p>
            <p className="text-lg font-semibold mt-2">สถานที่จัดกิจกรรม:</p>
            <p>{eventData.location}</p>
            <p className="text-lg font-semibold mt-2">รายละเอียด:</p>
            <p>{eventData.description}</p>
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
            <p className="text-lg font-semibold mb-2">ดูรายละเอียดเพิ่มเติม</p>
            <QRCodeSVG 
            className="mx-auto"
            value={eventData.link_other}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
          />
          </div>
        </div>
      </div>

        {/* ChatContainer */}
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