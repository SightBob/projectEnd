'use client'
import CalendarComponent from "@/components/Calendar";
import CartEvent from "@/components/CartEvent";
const Page = () => {
 return ( 
    <div className="w-full flex min-h-[calc(100vh_-_8rem)] ">
      <div className="container flex space-x-3 max-md:flex-col">
        <div className="w-[350px] border max-md:w-full sticky-category">
        <div className="w-full  rounded-full bg-white mb-4">
        </div>
        <div className=" max-md:flex max-md:items-center max-md:space-x-3 max-sm:flex-col ">
          <CalendarComponent />
          
          </div>
        </div>
        <div className="w-full grid grid-cols-4 gap-3  max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:place-items-center">
            <div className=""></div>
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