'use client'

import { Pagination, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Ensure this is imported if needed

import Image from 'next/image';

import Link from 'next/link';

import CartEvent from '@/components/CartEvent';
import CalendarComponent from '@/components/Calendar';
import CartActivity from '@/components/CartActivity';

import { useSession } from "next-auth/react";

export default function Home() {

  const { data: session} = useSession();
  console.log("Home: ", session);

  return (
    <main className="max-h-screen container">
        <div className="flex justify-between space-x-3 max-lg:h-[380px] max-lg:space-x-0">

        <Swiper
          modules={[Pagination, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{
            delay: 2000, // ระยะเวลาระหว่างการเปลี่ยนสไลด์ (ในหน่วยมิลลิวินาที)
            disableOnInteraction: true, // ให้ autoplay ทำงานต่อหลังจากที่ผู้ใช้มีปฏิสัมพันธ์
          }}

          pagination={{ clickable: true }}
          // onSwiper={(swiper) => console.log(swiper)}
          // onSlideChange={() => console.log('slide change')}
        >
         <SwiperSlide>
            <div className="relative w-full h-full"> 
              <Image
                src="/assets/img_main/banner-1.png"
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="relative w-full h-full"> 
              <Image
                src="/assets/img_main/banner-1.png"
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
          <div className="relative w-full h-full"> 
              <Image
                src="/assets/img_main/banner-1.png"
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>'
          <div className="relative w-full h-full"> 
              <Image
                src="/assets/img_main/banner-1.png"
                fill
                style={{ objectFit: 'cover' }} 
              />
            </div>
          </SwiperSlide>
        </Swiper>
        
          <div className="max-lg:hidden">
          <CalendarComponent/>
          </div>
        </div>

        <div className="flex lg:hidden space-x-4 mt-4 max-sm:flex-col max-sm:space-x-0 max-sm:items-center">
        <CalendarComponent/>
        <div className="bg-[rgba(255,102,0,0.7)] w-[350px] rounded-lg p-3 mt-2 h-fit max-lg:w-[50%] max-sm:max-w-[450px] max-sm:w-[98%]">
            <div className="flex justify-between items-center pb-1">
                <h3 className="text-2xl font-semibold text-white max-[1214px]:text-xl">กิจกรรม</h3>
                <select name="date" id="date" className="px-3 py-1.5 rounded-full text-lg max-[1214px]:text-xl">
                    <option value="today" selected>วันนี้</option>
                    <option value="tomorrow">พรุ่งนี้</option>
                    <option value="yesterday">เมื่อวาน</option>
                </select>
            </div>
              <div className="h-[320px] overflow-scroll w-full">
              <CartActivity/>
                <CartActivity/>
                <CartActivity/>
                <CartActivity/>
              </div>
            </div>
        </div>


        <div className="flex justify-between space-x-3 mt-5 max-sm:space-x-0">
        <div className="mx-auto">
        <div className="text-[#FF6600] flex justify-between items-center px-2">
          <h3 className="text-xl max-[1214px]:text-lg">กิจกรรมที่คุณอาจสนใจ</h3>
          <Link className='flex items-center space-x-2 text-xl max-[1214px]:text-lg' href="#">ดูทั้งหมด <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.5" class="size-6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg></span></Link>
        </div>
          <div className="grid grid-cols-3 mt-3 max-xl:grid-cols-3 max-lg:grid-cols-3 gap-4 w-auto max-md:grid-cols-3 max-lg:w-full max-[510px]:grid-cols-1">
            <CartEvent/>
            <CartEvent/>
            <CartEvent/>
            <CartEvent/>
            <CartEvent/>
            <CartEvent/>
          </div>
        </div>
              <div className="bg-[rgba(255,102,0,0.7)] min-w-[250px] rounded-lg p-3 mt-2 h-fit max-lg:hidden ">
            <div className="flex justify-between items-center pb-1">
                <h3 className="text-2xl font-semibold text-white max-[1214px]:text-xl">กิจกรรม</h3>
                <select name="date" id="date" className="px-3 py-1.5 rounded-full text-lg max-[1214px]:text-xl">
                    <option value="today" selected>วันนี้</option>
                    <option value="tomorrow">พรุ่งนี้</option>
                    <option value="yesterday">เมื่อวาน</option>
                </select>
            </div>
              <div className="h-[320px] overflow-scroll w-full">
                
              <CartActivity/>
                <CartActivity/>
                <CartActivity/>
                <CartActivity/>
              </div>
            </div>
        </div>
    </main>
  );
}