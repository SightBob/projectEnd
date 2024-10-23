'use client'

import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import Image from 'next/image';
import Link from 'next/link';

import CartEvent from '@/components/CartEvent';
import CalendarComponent from '@/components/Calendar';
import CartActivity from '@/components/CartActivity';
import axios from 'axios';
import { useSession } from "next-auth/react";

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dataCaledar, setDataCaledar] = useState([]);
  const [dataInterest, setDataInterest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();

      // console.log("session: ", session);
      try {
        if (selectedDate) {
          setIsLoading(true);
          const dateToSend = getLocalDateString(selectedDate);
          const res = await axios.get('/api/data/date', {
            params: { date: dateToSend }
          });
          // console.log('Response:', res.data.getPost);
          setDataCaledar(res.data.getPost);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const fetchInterest = async () => {
      try {
        let res;

        if (status === "authenticated" && session?.user?.uuid) {
          res = await axios.get('/api/interest', {
            params: { user: session.user.uuid }
          });
        } else {
          res = await axios.get('/api/interest');
        }

        // console.log('setDataInterest:', res.data.getPost);
        setDataInterest(res.data.getPost);
      } catch (error) {
        console.error('Error fetching data:', error);

      }
    };

    fetchInterest();
  }, [session, status]);



  return (
    <main className="min-h-screen container">
      <div className="flex justify-between space-x-3 max-lg:h-[380px] max-lg:space-x-0">
        <Swiper
          modules={[Pagination, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
          pagination={{ clickable: true }}
        >
          <Swiper
            modules={[Pagination, A11y, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            autoplay={{
              delay: 2000,
              disableOnInteraction: true,
            }}

            pagination={{ clickable: true }}

          >
            <SwiperSlide>
              <div className="relative w-full h-full">
              <Image
                src="/assets/img_main/banner-1.png"
                fill // Using 'fill' 
                style={{ objectFit: 'cover' }} 
                alt="promote banner advertise"
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority 
              />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
              <Image
                src="/assets/img_main/banner-1.png"
                fill // Using 'fill' 
                style={{ objectFit: 'cover' }} 
                alt="promote banner advertise"
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority 
              />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="relative w-full h-full">
              <Image
                src="/assets/img_main/banner-1.png"
                fill // Using 'fill' 
                style={{ objectFit: 'cover' }} 
                alt="promote banner advertise"
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority 
              />
              </div>
            </SwiperSlide>
            <SwiperSlide>'
              <div className="relative w-full h-full">
              <Image
                src="/assets/img_main/banner-1.png"
                fill // Using 'fill' 
                style={{ objectFit: 'cover' }} 
                alt="promote banner advertise"
                sizes="(max-width: 768px) 100vw, 50vw" 
                priority 
              />
              </div>
            </SwiperSlide>
          </Swiper>
        </Swiper>
        <div className="max-lg:hidden">
          <CalendarComponent onDateChange={setSelectedDate} selectedDate={selectedDate} />
        </div>
      </div>

      <div className="flex lg:hidden space-x-4 mt-4 max-sm:flex-col max-sm:space-x-0 max-sm:items-center">
         <CalendarComponent onDateChange={setSelectedDate} selectedDate={selectedDate} />
        <div className="bg-[rgba(255,102,0,0.7)] w-[350px] rounded-lg p-3 mt-2 h-fit max-lg:w-[50%] max-sm:max-w-[450px] max-sm:w-[98%] ">
          <div className="flex justify-between items-center pb-1">
            <h3 className="text-2xl font-semibold text-white max-[1214px]:text-xl">กิจกรรม</h3>
            <div className="bg-white rounded-full px-2 py-1">
              <h4>{selectedDate.toDateString()}</h4>
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-scroll">
          {isLoading ? (
            <div className='w-full py-4 rounded-md flex justify-center items-center bg-white mt-4'>
              <div className="loading-spinner"></div>
            </div>
          ) : dataCaledar.length > 0 ? (
            dataCaledar.map((item, index) => (
              <CartActivity
                key={index}
                id={item._id}
                img={item.picture}
                title={item.title}
                start_date={item.start_date}
                start_time={item.start_time}
              />
            ))
          ) : (
            <div className='w-full py-4 rounded-md flex justify-center items-center bg-white mt-4'>
              ไม่พบข้อมูลกิจกรรม
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-3 mt-5 max-sm:space-x-0">
        <div className="w-full">
          <div className="text-[#FF6600] flex justify-between items-center">
            <h3 className="text-xl max-[1214px]:text-lg">กิจกรรมที่คุณอาจสนใจ</h3>
            <Link className='flex items-center space-x-2 text-xl max-[1214px]:text-lg' href="/sutevent">
              ดูทั้งหมด <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></span>
            </Link>
          </div>
          <div className="grid grid-cols-4 mt-3 max-xl:grid-cols-3 max-lg:grid-cols-3 gap-4 w-auto max-[660px]:grid-cols-2 max-lg:w-full max-[435px]:grid-cols-1 place-items-center">
            {dataInterest.length > 0 ?
              (
                dataInterest.map((item, index) => (
                  <CartEvent key={index} id={item._id} img={item.picture} title={item.title} start_date={item.start_date} start_time={item.start_time} location={item.location} userId={session?.user?.uuid} favorites={item.favorites} views={item.views} />
                ))
              )
              : <><div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
                <LoadingSpinner />
              </div></>}
          </div>
        </div>
        <div className="bg-[rgba(255,102,0,0.7)] max-w-[350px] rounded-lg p-3 mt-2 h-fit max-lg:hidden">
          <div className="flex justify-between items-center pb-1 w-full">
            <h3 className="text-2xl font-semibold text-white max-[1214px]:text-xl">กิจกรรม</h3>
            <div className="bg-white rounded-full px-2 py-1">
              <h4>{selectedDate.toDateString()}</h4>
            </div>
          </div>
          <div className="max-h-[320px] min-w-[320px] overflow-y-scroll">
          {isLoading ? (
            <div className='w-full py-4 rounded-md flex justify-center items-center bg-white mt-4'>
              <div className="loading-spinner"></div>
            </div>
          ) : dataCaledar.length > 0 ? (
            dataCaledar.map((item, index) => (
              <CartActivity
                key={index}
                id={item._id}
                img={item.picture}
                title={item.title}
                start_date={item.start_date}
                start_time={item.start_time}
              />
            ))
          ) : (
            <div className='w-full py-4 rounded-md flex justify-center items-center bg-white mt-4'>
              ไม่พบข้อมูลกิจกรรม
            </div>
          )}
          </div>
        </div>
      </div>
    </main>
  );
}