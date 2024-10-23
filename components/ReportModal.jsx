import { useState } from 'react';
import axios from 'axios'; // นำเข้า axios


const ReportModal = ({ onClose, postId, userId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // สำหรับแสดงสถานะการส่ง

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // ตรวจสอบว่ามีเหตุผลการรายงานแล้ว
    if (!selectedReason) {
      alert('กรุณาเลือกเหตุผลในการรายงาน');
      return;
    }
  
    // ตรวจสอบค่า postId และ userId ว่ามีค่าอยู่หรือไม่
    // console.log('postId:', postId);
    // console.log('userId:', userId);
  
    const reportData = {
      reason: selectedReason === 'อื่นๆ' ? otherReason : selectedReason,
      postId,   // รหัสโพสต์ที่ถูกรายงาน
      userId    // รหัสผู้ใช้ที่ทำการรายงาน
    };
  
    // console.log('Sending report data:', reportData); // log ข้อมูลที่ถูกส่งไป
  
    try {
      setIsSubmitting(true);
      const response = await axios.post('/api/report', reportData);
  
      if (response.status === 200) {
        alert('ส่งรายงานสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการส่งรายงาน');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      const errorMessage = error.response ? error.response.data.message : error.message;
      alert('ไม่สามารถส่งรายงานได้: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
      onClose(); // ปิด modal หลังจาก submit
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">รายงานโพสต์</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="reportReason">เลือกเหตุผล:</label>
          <select
            id="reportReason"
            value={selectedReason}
            onChange={handleReasonChange}
            className="border p-2 rounded-md w-full mb-4"
          >
            <option value="">เลือกเหตุผล</option>
            <option value="เนื้อหาที่ไม่เหมาะสม">เนื้อหาที่ไม่เหมาะสม</option>
            <option value="การหลอกลวง">การหลอกลวง</option>
            <option value="สแปม">สแปม</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>

          {selectedReason === 'อื่นๆ' && (
            <div className="mb-4">
              <label htmlFor="otherReason">กรุณาระบุเหตุผลเพิ่มเติม:</label>
              <textarea
                id="otherReason"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="border p-2 rounded-md w-full"
                placeholder="พิมพ์เหตุผลของคุณที่นี่"
                rows="4"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
            disabled={isSubmitting} // ปิดปุ่มเมื่อกำลังส่งข้อมูล
          >
            {isSubmitting ? 'กำลังส่ง...' : 'ส่งรายงาน'}
          </button>
        </form>
        <button
          className="mt-4 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md"
          onClick={onClose}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
};

export default ReportModal;
