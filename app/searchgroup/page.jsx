'use client'
import CalendarComponent from "@/components/Calendar";
import CartEvent from "@/components/CartEvent";
const Page = () => {
 return ( 
  <div className="w-full flex min-h-[calc(100vh_-_8rem)] ">
  <div className="container flex space-x-3 max-md:flex-col max-sm:space-x-0">
    <div className="w-[350px] border max-md:w-full">
        <div className="max-md:flex max-md:items-start max-sm:items-center max-md:space-x-3 max-sm:flex-col max-sm:space-x-0 mt-10">
        <CalendarComponent />
          </div>
        </div>
        <div className="w-full">
          <div className="text-orange-400 text-[30px] max-md:text-center max-md:mt-5">การเปิดรับสมัครสมาชิก</div>
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
    </div>
   );
};
export default Page;