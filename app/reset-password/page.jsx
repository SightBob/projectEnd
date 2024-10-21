'use client'

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

export default function PasswordResetPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('รหัสผ่านไม่ตรงกัน');
      setIsSuccess(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      });
      setMessage(response.data.message);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error details:', error);
      setMessage(error.response?.data?.message || 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(70vh_-_8rem)] bg-gray-100 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="container">
        <div className="sm:mx-auto max-w-[350px] mx-auto w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            รีเซ็ตรหัสผ่านของคุณ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ป้อนรหัสผ่านใหม่ของคุณด้านล่าง
          </p>
        </div>

        <div className="mt-8 sm:mx-auto max-w-[350px] mx-auto w-full sm:max-w-md">
          <div className="bg-white py-6 px-6 shadow rounded-lg sm:px-8">
            {message && (
              <div className={`mt-2 ${isSuccess ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-l-4 p-4 rounded-md`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {isSuccess ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  รหัสผ่านใหม่
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  {isLoading ? 'กำลังรีเซ็ต...' : 'รีเซ็ตรหัสผ่าน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}