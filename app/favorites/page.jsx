'use client';
import { useState } from 'react';
import CalendarComponent from "@/components/Calendar";
import CartFavoritesEvent from "@/components/CartFavoritesEvent";
import CartActivity from "@/components/CartActivity";

const Page = () => {
  const [events, setEvents] = useState([
    { id: 1, name: "Event 1" },
    { id: 2, name: "Event 2" },
    { id: 3, name: "Event 3" },
    { id: 4, name: "Event 4" },
  
  ]);

  const handleRemoveEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="w-full flex min-h-[calc(100vh_-_8rem)]">
      <div className="container flex space-x-3 max-sm:space-x-0 max-md:flex-col-reverse">
        {/* Favorite Items Grid */}
        <div className="w-full">
          <div className="text-orange-400 text-[30px] max-md:text-center max-md:mt-5">รายการโปรด</div>
          <div className="w-full grid grid-cols-4 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:grid-cols-2 max-md:mt-4 max-md:place-items-center max-sm:gap-4 max-[440px]:grid-cols-1">
            {events.map(event => (
              <CartFavoritesEvent key={event.id} onRemove={() => handleRemoveEvent(event.id)} />
            ))}
          </div>
        </div>

        {/* Calendar and Activities Section */}
        <div className="w-[350px] max-md:w-full flex flex-col space-y-4">
          {/* Calendar Component */}
          <div className="w-full">
            <CalendarComponent />
          </div>

          {/* Nearby Activities */}
          <div className="bg-[rgba(255,102,0,0.7)] w-full rounded-lg p-3 h-fit">
            <div className="flex justify-between items-center pb-1">
              <h3 className="text-2xl font-semibold text-white max-[1214px]:text-xl">กิจกรรมใกล้เคียง</h3>
            </div>
            <div className="h-[300px] overflow-scroll w-full">
              <CartActivity />
              <CartActivity />
              <CartActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
