'use client'

import Image from "next/image"
import Link from "next/link"
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if(session) router.push('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { username, password });

      if (response.status === 200) {
        // ใช้ NextAuth signIn function เพื่อสร้าง session
        const result = await signIn('credentials', {
          redirect: false,
          username,
          password,
        });

        if (result.error) {
          setError(result.error);
        } else {
          router.push('/'); // หรือหน้าที่ต้องการหลังจาก login สำเร็จ
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // ข้อผิดพลาดจาก server
        setError(error.response.data.message);
      } else if (error.request) {
        // ไม่ได้รับการตอบกลับจาก server
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      } else {
        // ข้อผิดพลาดอื่นๆ
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    }
  };

  return (
    <div className="w-full flex h-[calc(100vh_-_8rem)] ">
      <div className="w-[50%] bg-white flex flex-col items-center justify-center max-md:w-full">
        <h2 className="text-3xl text-center">เข้าสู่ระบบ</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="max-w-[300px] w-full mx-auto mt-6 flex flex-col">
          <label htmlFor="username">ชื่อผู้ใช้ หรือ อีเมล</label>
          <input
            id="username"
            className="px-3 mt-2 border rounded-md max-w-[300px] py-1 w-full"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="mt-5" htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            className="px-3 border rounded-md max-w-[300px] py-1 w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link className="self-end text-[#EBB557] text-sm" href="">ลืมรหัสผ่าน?</Link>
          <button className="bg-[#FD8D64] py-2 w-full rounded-md text-white mt-4" type="submit">ล็อคอิน</button>
          <p className="mt-2 self-end">ยังไม่มีบัญชีผู้ใช้ <Link className="text-[#EBB557]" href="register">สมัครสมาชิกที่นี่</Link></p>
        </form>
      </div>
      <div className="w-[50%] bg-[#FFDDD0] h-[calc(100vh_-_8rem)] max-md:hidden">
        <div className="w-auto h-[7rem] relative top-[50%] translate-y-[-50%]">
          <Image
            layout="fill"
            src="/assets/img_main/logo-full.png"
            className="object-contain"
            alt="Logo"
          />
        </div>
      </div>
    </div>
  )
}

export default Page