import Image from "next/image"

const CartInterest = ({ title, name_img }) => {
  return (<div>
    <div className="bg-white shadow-[rgba(149,157,165,0.2)_0px_8px_24px] max-w-[300px] w-full p-3 rounded-lg flex flex-col items-center">
        <div className="relative size-[13rem] rounded-lg overflow-hidden">
            <Image className="object-cover" layout="fill" src={`/assets/img_inter/${name_img}.png`} />
        </div>
        <h3 className="text-2xl mt-4">{title}</h3>
    </div>
  </div>)
}

export default CartInterest