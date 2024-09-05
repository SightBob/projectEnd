import Image from "next/image"
import Link from "next/link"

const CartActivity = ({ img, title, start_date, start_time, id }) => {
  return (
        <Link href={`page/${id}`} className="bg-white w-full rounded-lg p-2 mt-3 py-3 flex items-center space-x-2 cursor-pointer">
            <div className="relative size-[4rem] bg-white">
                <Image className="object-cover" layout="fill" objectFit="contain" alt="image event" src={img} />
            </div>
            <div className="">
            <h3 className="line-clamp-1 text-lg">{title}</h3>
            <p className="line-clamp-1">วันที่ {start_date} เวลา {start_time}</p>
            </div>
        </Link>
       
  )}

export default CartActivity