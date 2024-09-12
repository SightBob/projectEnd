"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CalendarComponent from "@/components/Calendar";
import CartEvent from "@/components/CartEvent";
import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";

const Page = ({}) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function getLocalDateString(date) {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/data/date?type=event');
        setAllEvents(res.data.getPost);
        console.log("res.data.getPost, :", res.data.getPost);
        setFilteredEvents(res.data.getPost);
      } catch (error) {
        console.error('Error fetching all data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const dateToFilter = getLocalDateString(selectedDate);
      const filtered = allEvents.filter(event => event.start_date === dateToFilter);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(allEvents);
    }
  }, [selectedDate, allEvents]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  
  const categories = [
    "กีฬา",
    "ภูเขา",
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
      <div className="container flex space-x-3 max-md:flex-col max-sm:space-x-0">
        <div className="w-[350px] max-md:w-full">
          {/* ... (ส่วนอื่นๆ ของ JSX) */}
          <div className="max-md:flex max-md:items-start max-sm:items-center max-md:space-x-3 max-sm:flex-col max-sm:space-x-0">
            <button 
              onClick={clearSelectedDate}
              className="mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md mb-4"
            >
              ล้างวันที่ที่เลือก
            </button>
            <CalendarComponent onDateChange={setSelectedDate} selectedDate={selectedDate} />
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
                      ? "bg-[#FF6600] text-white"
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
        <div className="w-full grid grid-cols-4 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
          {isLoading ? (
              <div className='grid-cols-1 h-[410px] border-2 rounded-lg w-full flex justify-center items-center bg-white'>
                <LoadingSpinner/>
              </div>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((item, index) => (
              <CartEvent key={index} id={item._id} img={item.picture} title={item.title} start_date={item.start_date} start_time={item.start_time} location={item.location} />
            ))
          ) : (
            <p>ไม่พบข้อมูลกิจกรรม</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;