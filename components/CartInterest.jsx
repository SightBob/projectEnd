import Image from "next/image";

const CartInterest = ({ title, name_img, alt_img, isSelected, onClick }) => {
  return (
    <div className="col-span-1 relative overflow-hidden rounded-md" onClick={onClick}>
      <div className={`bg-white shadow-[rgba(149,157,165,0.2)_0px_8px_24px] max-w-[300px] w-full p-3 rounded-lg flex flex-col items-center cursor-pointer`}>
        <div className="relative size-[10rem] rounded-lg overflow-hidden max-[415px]:size-[7rem]">
          <Image className="object-cover" layout="fill" alt={`${alt_img}`} src={`/assets/img_inter/${name_img}.png`} />
        </div>
        <h3 className="text-xl mt-4 max-[415px]:text-lg">{title}</h3>
      </div>

      <div className={`${isSelected ? 'absolute top-0 left-0 right-0 bottom-0 bg-[rgba(25,160,27,.5)] grid place-items-center' : 'hidden'}`}>
          <div className="size-[3rem] bg-white rounded-full grid place-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" class="size-6 text-green-600" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          </div>
      </div>
    </div>
  );
};

export default CartInterest;