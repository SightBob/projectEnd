'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CalendarComponent from "@/components/Calendar";
import CartEvent from "@/components/CartEvent";

const Page = ({}) => {

  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const categories = [
    "กีฬา",
    "ชมรม",
    "ทะเล",
    "ธรรมชาติอื่นๆ",
    "เฟสติวัล & ไนท์ไลฟ์",
    "แอดเวนเจอร์",
    "วัฒนธรรม",
    "กิจกรรมนักช้อป",
    "กิจกรรมทั่วไป",
    "กิจกรรมครอบครัว",
    "สายมู",
    "ฟู้ดทัวร์",
    "Wellness",
    "ศิลปะและงานฝีมือ",
    "โรงแรม",
    "อื่นๆ",
  ];

  return (
    <div className="w-full flex min-h-[calc(100vh_-_8rem)] ">
      <div className="container flex space-x-3 max-md:flex-col">
        <div className="w-[350px] border max-md:w-full sticky-category">
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
        <div className=" max-md:flex max-md:items-center max-md:space-x-3 max-sm:flex-col ">
          <CalendarComponent />
          
          <div className="CategoriesTag justify-start items-start gap-2 inline-flex flex-wrap p-4 bg-white mt-4 max-md:mt-0 rounded-lg max-sm:mt-4 max-sm:max-w-[450px]">
              <div className="w-full flex justify-between">
                <div className="">หมวดหมู่</div>
                <div className="" onClick={() => setSelectedCategories([])}>
                  ล้างทั้งหมด
                </div>
              </div>
              {categories.map((category) => (
                <span
                  key={category}
                  className={`ant-tag px-[8px] py-[4px] gap-[8px] rounded-[4px] m-0 border-none flex items-center h-[32px] cursor-pointer ${
                    selectedCategories.includes(category)
                      ? "bg-[#fb9048] text-white"
                      : "bg-[#F2F2F2] text-[#767676]"
                  }`}
                  onClick={() => toggleCategory(category)}
                >
                  <p className="text-[14px] leading-[20px] font-[400]">
                    {category}
                  </p>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full grid grid-cols-4 gap-3  max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:place-items-center">
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
