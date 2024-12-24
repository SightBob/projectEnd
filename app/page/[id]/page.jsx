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
import DOMPurify from 'dompurify';
import { Toaster, toast } from 'react-hot-toast';

const EventDetail = ({ params }) => {
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [name, setName] = useState({});
  const { data: session } = useSession();
  const [showReportModal, setShowReportModal] = useState(false);
  const viewIncrementedRef = useRef(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const cleanHTML = DOMPurify.sanitize;
  const handleReport = async (reason) => {
    
    if (!eventData || !session) {
      toast.error("ข้อมูลไม่ครบถ้วนหรือทำการล็อกอินก่อนทำรายการ");
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
        toast.success('รายงานสำเร็จ');
      } else {
        toast.error('ไม่สามารถรายงานได้');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('เกิดข้อผิดพลาดในการรายงาน: ' + error.response?.data?.message || error.message);
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
    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อเริ่มการพูดคุย");
      return;
    }
    if (eventData) {
      console.log('Organizer ID:', eventData.organizer_id);
      setSelectedContactId(eventData.organizer_id);
      setShowChat(true);
    }
  };

  const handleJoinEvent = () => {
    if (!session) {
      toast.error("กรุณาเข้าสู่ระบบเพื่อเข้าร่วมหรือยกเลิกการเข้าร่วมกิจกรรม");
      return;
    }
    setShowPolicyModal(true);
  };

  const confirmJoinEvent = async () => {
    setShowPolicyModal(false);
    try {
      const response = await axios.post('/api/data/event', {
        eventId: params.id,
        userId: session?.user?.uuid
      });

      if (response.data.success) {
        if (response.data.action === 'registered') {
          toast.success("คุณได้เข้าร่วมกิจกรรมเรียบร้อยแล้ว");
        } else if (response.data.action === 'unregistered') {
          toast.success("คุณได้ยกเลิกการเข้าร่วมกิจกรรมเรียบร้อยแล้ว");
        }
        await fetchEventData();
      } else {
        toast.error(response.data.message || "ไม่สามารถดำเนินการได้");
      }
    } catch (error) {
      console.error("Error processing event registration:", error);
      if (error.response) {
        toast.error(error.response.data.message || "เกิดข้อผิดพลาดในการดำเนินการ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
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
      <Toaster />
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
                    <Image src="/assets/img_main/chatIcon.png" alt="chat" width={24} height={24} />
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
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData.description) }}></p>
                  </>
                ) : null}
              </div>

              <div className="flex flex-col items-start ml-4 max-sm:ml-0 max-sm:mt-6">
                <div className="mb-4">
                  {eventData.link_other ? <>
                    <p className="text-lg font-semibold mb-3">ดูรายละเอียดเพิ่ม</p>
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
                      onClick={handleJoinEvent}
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

      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">นโยบายการเข้าร่วมกิจกรรม</h2>
            <p className="mb-4">
              ก่อนที่คุณจะเข้าร่วมกิจกรรมนี้ โปรดอ่านนโยบายต่อไปนี้:
            </p>
            <ul className="list-disc pl-5 mb-4">
              <li>ผู้เข้าร่วมต้องปฏิบัติตามกฎระเบียบของกิจกรรมอย่างเคร่งครัด</li>
              <li>ห้ามนำสิ่งของอันตรายหรือสิ่งผิดกฎหมายเข้ามาในพื้นที่จัดกิจกรรม</li>
              <li>ผู้เข้าร่วมต้องรับผิดชอบต่อทรัพย์สินส่วนตัวของตนเอง</li>
              <li>หากมีการยกเลิกการเข้าร่วม กรุณาแจ้งล่วงหน้าอย่างน้อย 24 ชั่วโมง</li>
              <li>การเข้าร่วมกิจกรรมนี้ถือว่าคุณยอมรับเงื่อนไขและข้อกำหนดทั้งหมด</li>
            </ul>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => setShowPolicyModal(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={confirmJoinEvent}
              >
                ยอมรับ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
