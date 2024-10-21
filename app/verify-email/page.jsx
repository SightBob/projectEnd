'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react'; // ใช้สำหรับการจัดการ session

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter(); 

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/verify-email', { token });

      if (response.status === 200) {
        // หลังจากยืนยันสำเร็จให้ทำการ signOut เพื่อรีเฟรช session
        await signOut({ redirect: false }); // ปิดการ redirect อัตโนมัติหลังจาก signOut
        setMessage('อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error details:', error);
      setMessage(error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleVerifyEmail();
    } else {
      setMessage('Token หายไป กรุณาตรวจสอบลิงก์ยืนยันอีเมลอีกครั้ง.');
    }
  }, [token]);

  const isErrorMessage = message.includes('ไม่ถูกต้อง') || message.includes('หมดอายุ');

  return (
    <div className="min-h-[calc(70vh_-_8rem)] bg-gray-100 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="container">
        <div className="sm:mx-auto max-w-[350px] mx-auto w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900">
            การยืนยันอีเมล
          </h2>
          {isLoading ? (
            <p className="mt-2 text-center text-lg text-gray-600">
              โปรดรอในขณะที่เรากำลังยืนยันอีเมลของคุณ...
            </p>
          ) : message ? (
            <p className="mt-2 text-center text-lg text-gray-600">
              {message}
            </p>
          ) : null}
        </div>

        <div className="mt-4 sm:mx-auto max-w-[350px] mx-auto w-full sm:max-w-md">
          <div className="bg-white py-6 px-6 shadow rounded-lg sm:px-8">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              message && (
                <div className={`mt-2 ${isErrorMessage ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'} border-l-4 p-4`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {isErrorMessage ? (
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${isErrorMessage ? 'text-red-700' : 'text-green-700'}`}>
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {!isErrorMessage && message.includes('ยืนยันเรียบร้อยแล้ว') && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => router.push('/login')} 
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition duration-200"
            >
              ไปยังหน้าเข้าสู่ระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

