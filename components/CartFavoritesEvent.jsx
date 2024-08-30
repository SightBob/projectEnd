'use client';
import Image from 'next/image';

const CartFavoritesEvent = ({ onRemove }) => {
  return (
    <div className="col-span-1 max-w-[300px] max-h-[410px] p-4 max-sm:p-2 rounded-lg bg-white relative max-[440px]:max-w-[100%] max-[440px]:p-4 max-[440px]:max-h-auto">
      <div className="absolute top-4 right-4 rounded-full border grid place-items-center cursor-pointer z-10" onClick={() => onRemove && onRemove()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 text-[#F64F72] fill-[#F64F72]" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </div>
      <div className="relative w-full h-[250px] max-[440px]:h-[200px]">
        <Image className="object-cover" layout="fill" objectFit="contain" alt="image event" src="https://oreg.rmutt.ac.th/wp-content/uploads/2019/01/40275-Converted-01.png" />
      </div>
      <div className="text-[#FF6600] mt-2">
        <h3 className="line-clamp-1 text-2xl max-[1521px]:text-xl">เปิดโลกชวนชมรมเปิดบูธกิจกรรม</h3>
        <h5 className="line-clamp-1 text-lg max-[1521px]:text-lg">วันที่ 17-26 กรกฏาคม 2567 เวลา 12.00 -13.00</h5>
        <p className="line-clamp-1 text-sm">สถานที่ ลานอเนกประสงค์ อาคารเรียวรวม1</p>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="bg-[#a6a6a6] px-6 py-2 rounded-md w-fit text-white cursor-pointer max-[1521px]:py-1 max-[1521px]:px-4 max-[440px]:px-6 max-[440px]:py-2">
          <p>รายละเอียด</p>
        </div>
        <div className="flex items-center space-x-2">
          <p>266</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CartFavoritesEvent;
