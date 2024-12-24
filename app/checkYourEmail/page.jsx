'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function CheckYourEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // ดึงค่า email จาก query string
  const [notification, setNotification] = useState('');
  const { data: session } = useSession(); 
  const [hasResent, setHasResent] = useState(false); // สถานะการส่งอีเมล
  const router = useRouter();

  useEffect(() => {
    const resendVerificationEmail = async () => {
      if (email && session?.user?.verifyEmail === false && !hasResent) {
        try {
          const response = await axios.post('/api/auth/resend-verification-email', { email });
          setNotification(response.data.message);
          setHasResent(true);
        } catch (error) {
          console.error('Error resending email:', error);
          setNotification('ส่งอีเมลยืนยันไม่สำเร็จ');
        }
      }
    };

    resendVerificationEmail();
  }, [session?.user?.verifyEmail, hasResent]);

  const resendVerificationEmail = async () => {
    try {
      const response = await axios.post('/api/auth/resend-verification-email', { email });
      setNotification(response.data.message);
    } catch (error) {
      console.error('Error resending email:', error);
      setNotification('ส่งอีเมลยืนยันไม่สำเร็จ');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(90vh_-_8rem)] bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md text-center">
        {/* แสดงข้อความแจ้งเตือน */}
        {notification && (
            <div className={`mt-2 ${notification.includes('ไม่สำเร็จ') ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'} border-l-4 p-4`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className={`h-5 w-5 ${notification.includes('ไม่สำเร็จ') ? 'text-red-400' : 'text-green-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${notification.includes('ไม่สำเร็จ') ? 'text-red-700' : 'text-green-700'} text-center mx-auto`}>
                    {notification}
                  </p>
                </div>
              </div>
            </div>
        )}
        <div className="text-green-500 text-5xl mb-4">
          <i className="fas fa-envelope"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">กรุณายืนยันอีเมลของคุณ</h2>
        <p className="text-gray-600 mb-2">
          คุณเกือบจะเสร็จแล้ว! เราได้ส่งอีเมลไปที่ 
        </p>
        <p className='mt-2 mb-1 text-gray-600'>
          <strong>{email}</strong>
        </p>

        <button 
          onClick={resendVerificationEmail} 
          className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
        >
          ส่งอีเมลยืนยันอีกครั้ง
        </button>
        <button 
          onClick={() => router.push('/login')} 
          className="ml-4 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-300 transition duration-200"
        >
          ล็อกอิน
        </button> 
      </div>
    </div>
  );
}
