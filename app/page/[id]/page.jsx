"use client";

import Image from 'next/image';
import ChatContainer from '@/components/ChatContainer';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { format, addYears } from 'date-fns';
import { th } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';
import ReportModal from '@/components/ReportModal';

const EventDetail = ({ params }) => {
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [name, setName] = useState({});
  const { data: session } = useSession();
  const [showReportModal, setShowReportModal] = useState(false);
  const viewIncrementedRef = useRef(false);


  const handleReport = async (reason) => {
    if (!eventData || !session) {
      alert("ข้อมูลไม่ครบถ้วน กรุณาลองใหม่");
      return;
    }
  
    try {
      console.log('Sending report with data:', {
        postId: eventData._id,  // Ensure this is set correctly
        userId: session.user.uuid, // Ensure this is set correctly
        reason
      });
  
      const response = await axios.post('/api/report', {
        postId: eventData._id,
        userId: session.user.uuid,
        reason
      });
  
      if (response.status === 200) {
        alert('รายงานสำเร็จ');
      } else {
        alert('ไม่สามารถรายงานได้');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('เกิดข้อผิดพลาดในการรายงาน: ' + error.response?.data?.message || error.message);
    }
  };

  const fetchEventData = async () => {
    try {
      const res = await axios.get("/api/data/PostId", {
        params: { id: params.id }
      });
      if (res.data && res.data.post) {
        setEventData(res.data.post.getPost);
        // console.log("res.data.post.getPost: ", res.data.post.getPost);
        setName(res.data.post.nameOrganizer);

      } else {
        throw new Error("No event data in response");
      }
    } catch (error) {
      console.error("Error fetching event detail: ", error);
      setError(error.message || "Failed to load event data");
    }
  };

  useEffect(() => {
    fetchEventData();
    if (!viewIncrementedRef.current) {
      incrementViewCount();
      viewIncrementedRef.current = true;
    }
  }, [params.id]);

  const incrementViewCount = async () => {
    try {
      const response = await axios.post('/api/incrementViews', { id: params.id });
      console.log('View count updated:', response.data);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const handleClickChat = () => {
    if (eventData) {
      console.log('Organizer ID:', eventData.organizer_id);
      setSelectedContactId(eventData.organizer_id);
      setShowChat(true);
    }
  };

  const joinEvent = async () => {
    if (!session) {
      alert("กรุณาเข้าสู่ระบบเพื่อเข้าร่วมหรือยกเลิกการเข้าร่วมกิจกรรม");
      return;
    }

    try {
      const response = await axios.post('/api/data/event', {
        eventId: params.id,
        userId: session?.user?.uuid
      });

      if (response.data.success) {
        if (response.data.action === 'registered') {
          alert("คุณได้เข้าร่วมกิจกรรมเรียบร้อยแล้ว");
        } else if (response.data.action === 'unregistered') {
          alert("คุณได้ยกเลิกการเข้าร่วมกิจกรรมเรียบร้อยแล้ว");
        }
        // Fetch updated event data
        await fetchEventData();
      } else {
        alert(response.data.message || "ไม่สามารถดำเนินการได้");
      }
    } catch (error) {
      console.error("Error processing event registration:", error);
      if (error.response) {
        alert(error.response.data.message || "เกิดข้อผิดพลาดในการดำเนินการ");
      } else {
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      }
    }
  };

  function formatThaiDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const buddhistYear = addYears(date, 543);

    return format(buddhistYear, "วันที่ d MMMM yyyy เวลา HH:mm 'น.'", { locale: th });
  }

  if (error)
    return (
      <div>
        Error: {error}
      </div>
    );
  if (!eventData)
    return (
      <div className="min-h-screen grid place-items-center">
        <LoadingSpinner />
      </div>
    );

    const currentDateTime = new Date();
    const eventEndDateTime = new Date(`${eventData.end_date}T${eventData.end_time}`);

    const isEventFull = eventData.current_participants === eventData.maxParticipants;
    const isUserJoined = eventData.participants.includes(session?.user?.uuid);
    const isRegistrationClosed = currentDateTime >= eventEndDateTime;

  return (
    <div className="container max-w-[1240px] mx-auto">
      <div className="flex">
        {/* Left Section - 75% */}
        <div className="flex-[3]">
          {/* Event Details Container */}
          <div className="bg-white p-6 rounded-lg shadow-md max-sm:p-3">
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
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  className="rounded-full border-4 border-white object-cover"
                  fill
                  alt="Organizer Profile"
                  src={ name.profilePicture || "/assets/img_main/usericon.png"}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  {/* Organizer's Name */}
                  <p className="font-bold">
                    {name.firstname + " " + name.lastname || 'Unknown Organizer'}
                  </p>

                  {/* Message Button */}
                  <button
                    className="ml-2 flex items-center justify-center bg-transparent text-gray-600 hover:text-blue-600 focus:outline-none"
                    onClick={handleClickChat}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* SVG Icon */}
                    <svg
                      className="w-6 h-6 text-gray-500 dark:text-gray-400 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <g stroke="#1C274C">
                        <path
                          strokeWidth="1.5"
                          d="M12 22a10 10 0 1 0-8.96-5.55..."
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h0m4 0h0m4 0h0"
                          opacity=".5"
                        />
                      </g>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center">
                  <p className="text-sm text-gray-500">
                    {formatThaiDate(eventData.created_at)}
                  </p>

                  {/* Report Button */}
                  <button
                    className="ml-2 flex items-center justify-center bg-transparent text-gray-600 hover:text-red-600 focus:outline-none"
                    onClick={() => setShowReportModal(true)}
                  >
                    {/* SVG Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="flex max-sm:flex-col">
              <div className="flex-1">
              
                <h1 className="text-2xl font-bold mb-4">{eventData.title}</h1>

                {eventData.start_date ? <>
                  <p className="text-lg font-semibold" >วันที่จัดกิจกรรม:</p>  
                <p>
                  {formatThaiDate(eventData.start_date)}
                  {eventData.end_date && ` - ${formatThaiDate(eventData.end_date)}`}
                </p></>: "" }
                  
                {eventData.location ?  <>                
                  <p className="text-lg font-semibold mt-2">สถานที่จัดกิจกรรม:</p>
                  </> : ""}

                <p>{eventData.location}</p>
                {eventData.description ? (
                  <>
                    <p className="text-lg font-semibold mt-2">รายละเอียด:</p>
                    <pre>{eventData.description}</pre>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col items-start ml-4 max-sm:ml-0 max-sm:mt-6">
                <div className="mb-4">
                  {eventData.link_other ? <>
                    <p className="text-lg font-semibold mb-3">ดูรายละเอียดเพิ่มเติม</p>
                  <QRCodeSVG
                    className="mx-auto"
                    value={eventData.link_other || "https://default-link.com"}
                    size={150}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                  /></> : "" }
                  
                </div>
                {eventData.member === 'yes' && (
                  <div className="flex flex-col items-center">
                    ผู้เข้าร่วม: {eventData.current_participants} / {eventData.maxParticipants}
                    <button
                      className={`bg-orange-400 text-white px-7 py-2 rounded-lg mt-2 ${
                        isEventFull || isRegistrationClosed ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-500"
                      }`}
                      onClick={joinEvent}
                      disabled={isEventFull || isRegistrationClosed}
                    >
                      {isEventFull
                        ? "คนเข้าร่วมเต็มแล้ว"
                        : isUserJoined
                        ? 'คุณเข้าร่วมแล้ว'
                        : isRegistrationClosed
                        ? 'ปิดรับสมัครแล้ว'
                        : 'เข้าร่วมกิจกรรม'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
       <ReportModal
       isOpen={showReportModal}
       onClose={() => setShowReportModal(false)}
       onSubmit={handleReport}
       postId={eventData._id}
       userId={session?.user?.uuid}
     />
      )}

      {/* Chat Container */}
      {showChat && (
        <div className="fixed bottom-4 right-4 z-[250]">
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
