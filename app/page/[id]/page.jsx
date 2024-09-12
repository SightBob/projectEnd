"use client";

import Image from 'next/image';
import Link from 'next/link';
import CalendarComponent from '@/components/Calendar';

import { useEffect, useState } from 'react';
import axios from 'axios';

import { format, addYears } from 'date-fns';
import { th } from 'date-fns/locale';

import { QRCodeSVG } from 'qrcode.react';

import LoadingSpinner from '@/components/LoadingSpinner';

const EventDetail = ({ params }) => {
  
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);

  function formatThaiDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const buddhistYear = addYears(date, 543);
    
    return format(buddhistYear, "วันที่ d MMMM yyyy เวลา HH:mm 'น.'", { locale: th });
  }

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

  const [organizerName, setOrganizerName] = useState('');
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
                <p className="text-xl font-semibold">{organizerName || 'Unknown Organizer'}</p>
                <p className="text-sm text-gray-500">{formatThaiDate(eventData.created_at)}</p>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex">
              <div className="flex-1">
              <h1 className=" text-2xl font-bold mb-4">{eventData.title}</h1>
                <p className="text-lg font-semibold">วันที่จัดกิจกรรม:</p>
                <p>{formatThaiDate(eventData.start_date)} - {formatThaiDate(eventData.end_date)}</p>
                <p className="text-lg font-semibold mt-2">สถานที่จัดกิจกรรม:</p>
                <p>{eventData.location}</p>
                <p className="text-lg font-semibold mt-2">รายละเอียด:</p>
                <p>{eventData.description}</p>
              </div>

              {/* QR Code and "ดูรายละเอียดเพิ่มเติม" on the Right */}
              <div className="flex flex-col items-end ml-4">
                <div className="mb-4">
                  <p className="text-lg font-semibold mb-2">ดูรายละเอียดเพิ่มเติม</p>
                  <QRCodeSVG
                    className="mx-auto"
                    value={eventData.link_other}
                    size={150}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                  />
                </div>
                <button className="bg-orange-400 text-white px-7 py-2 rounded-lg  hover:bg-orange-500 pl-6 ">
                  เข้าร่วมกิจกรรม
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - 25% */}
        <div className="flex-[1]">
          {/* This space is reserved for future content */}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
