import Image from "next/image"

const CartInterest = ({ title, name_img, alt_img }) => {
  return (<div className="col-span-1">
    <div className="bg-white shadow-[rgba(149,157,165,0.2)_0px_8px_24px] max-w-[300px] w-full p-3 rounded-lg flex flex-col items-center">
        <div className="relative size-[10rem] rounded-lg overflow-hidden max-[415px]:size-[7rem]">
            <Image className="object-cover" layout="fill" alt={`${alt_img}`} src={`/assets/img_inter/${name_img}.png`} />
        </div>
        <h3 className="text-xl mt-4 max-[415px]:text-lg">{title}</h3>
    </div>
  </div>)
}

export default CartInterest