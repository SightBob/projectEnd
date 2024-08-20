import Image from "next/image";
import Link from "next/link";

import CalendarComponent from "@/components/Calendar";
import CartEvent from "@/components/CartEvent";
const Page = ({}) => {
  return (
    <div className="w-full flex min-h-[calc(100vh_-_8rem)] ">
      <div className="container flex space-x-3 max-md:flex-col max-sm:space-x-0">
        <div className="w-[350px] border max-md:w-full">
        <div className="w-full  rounded-full bg-white mb-4">
        <div className="search-container flex items-center rounded-md p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-6 h-6 text-gray-500 mr-2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z"
                />
              </svg>
              <input
                type="text"
                placeholder="ค้นหากิจกรรม..."
                className="w-full border-none outline-none"
              />
            </div>
        </div>
        <div className="max-md:flex max-md:items-start max-sm:items-center max-md:space-x-3 max-sm:flex-col max-sm:space-x-0">
          <CalendarComponent />
          
          <div class="justify-start items-start gap-2 inline-flex flex-wrap p-4 bg-white mt-4 max-md:mt-0 rounded-lg max-sm:mt-4 max-sm:max-w-[450px] max-md:py-6">
            <div className="w-full flex justify-between">
            <div className="">หมวดหมู่</div>
            <div className="">ล้างทั้งหมด</div>
            </div>
            <span
              class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined"
              ant-click-animating-without-extra-node="false"
            >
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                กีฬา
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                ภูเขา
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                ทะเล
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                ธรรมชาติอื่นๆ
              </p>
            </span>
            <span
              class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined"
              ant-click-animating-without-extra-node="false"
            >
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                เฟสติวัล &amp; ไนท์ไลฟ์
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                แอดเวนเจอร์
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                วัฒนธรรม
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                กิจกรรมนักช้อป
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                กิจกรรมทั่วไป
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                กิจกรรมครอบครัว
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                กีฬา
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                สายมู
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                ฟู้ดทัวร์
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                Wellness
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                ศิลปะและงานฝีมือ
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                โรงแรม
              </p>
            </span>
            <span class="ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] bg-[#F2F2F2] m-0 border-none flex items-center h-[32px] cursor-pointer undefined">
              <p class="text-[14px] text-[#767676] leading-[20px] font-[400]">
                อื่นๆ
              </p>
            </span>
          </div>
        </div>
        </div>
        <div className="w-full grid grid-cols-4 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
          <CartEvent />
        </div>
      </div>
    </div>
  );
};

export default Page;
