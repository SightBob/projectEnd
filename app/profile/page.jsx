'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
const Page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      async function fetchUserData() {
        try {
         
          const response = await fetch(`/api/profile?uid=${session.user.uuid}`);
          if (response.ok) {
            const data = await response.json();
            setUser(data);

            console.log(data);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }

      fetchUserData();
    }
  }, [status, session]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className='Container w-full flex justify-center items-center h-[calc(100vh)]'>
      <div className="max-w-7xl w-full mx-6 p-6 bg-white shadow-md rounded-lg">
        {/* Cover Image Container */}
        <div className="relative mb-10">
          <div 
            className="h-52 w-full bg-cover bg-center rounded-lg" 
            style={{ backgroundImage: "url('/assets/img_main/cover-cat.png')" }}
          ></div>
          <div className="absolute left-10 bottom-[-80px] flex items-center max-sm:left-1/2 max-sm:translate-x-[-50%] max-sm:flex-col">
            <div className="size-[8rem] relative">
              <Image
                layout="fill"
                src="/assets/img_main/Profile-cat.png"
                className="rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="ml-5 max-sm:ml-0">
              <h1 className="text-2xl font-bold max-md:text-xl">{user.username}</h1>
            </div>
          </div>
        </div>

        <div className="space-y-10 mt-28 px-10 pr-56 max-md:pr-35 max-sm:pr-0 max-sm:px-0">
          <div className="flex justify-between items-center">
            <span>ชื่อผู้ใช้</span>
            <span>{user.username}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>ชื่อจริง</span>
            <span>{user.firstname}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>นามสกุล</span>
            <span>{user.lastname}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>อีเมล</span>
            <span>{user.email}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>คณะ</span>
            <span>{user.faculty}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>สาขาวิชา</span>
            <span>{user.major}</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
