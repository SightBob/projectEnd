'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import CartEvent from "@/components/CartEvent";
import CalendarComponent from "@/components/Calendar";
import CartActivity from "@/components/CartActivity";
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import LoadingSpinner from '@/components/LoadingSpinner';

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [allPosts, setAllPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/favorite');
      setAllPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  useEffect(() => {
    if (session?.user?.uuid && allPosts.length > 0) {
      const userFavorites = allPosts.filter(post => 
        post.favorites.includes(session?.user?.uuid)
      );
      setFavorites(userFavorites);
    }
  }, [allPosts, session?.user?.uuid]);

  const handleFavoriteToggle = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };


  return (
    <div className="w-full flex min-h-[calc(100vh_-_8rem)]">
      {session?.user ? (
        <div className="container flex space-x-3 max-md:flex-col max-sm:space-x-0">
          {/* Favorite Items Grid */}
          <div className="w-full">
            <div className="text-orange-400 text-[30px] max-md:text-center max-md:mt-5">รายการโปรด</div>
            <div className="w-full mt-4 grid grid-cols-5 gap-3 max-xl:grid-cols-4 max-lg:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
              {isLoading ? (
                 <><div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
                 <LoadingSpinner />
               </div></>
              ) : favorites.length > 0 ? favorites.map(item => (
                <CartEvent 
                  key={item._id}
                  id={item._id} 
                  img={item.picture} 
                  title={item.title} 
                  start_date={item.start_date} 
                  start_time={item.start_time} 
                  location={item.location} 
                  member={item.member} 
                  maxParticipants={item.maxParticipants} 
                  current_participants={item.current_participants} 
                  userId={session?.user?.uuid} 
                  favorites={item.favorites}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )) : (
                <div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
                  <h2>ไม่พบรายการโปรด</h2>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 relative top-0 left-0 right-0 bottom-0 bg-gray-300 min-h-[calc(100vh_-_8rem)] w-full flex justify-center items-center">
          <div className="max-w-[350px] h-[400px] w-full bg-white flex flex-col items-center justify-center rounded-md">
            <div className="rounded-full overflow-hidden">
              <Image 
                src="/assets/img_main/profile.png" 
                layout="responsive"
                width={250} 
                height={250} 
                alt="Profile picture"
              />
            </div>
            <h2 className='mt-8'>กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้านี้</h2>
            <button onClick={() => router.push('/login')} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              ไปยังหน้าเข้าสู่ระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;