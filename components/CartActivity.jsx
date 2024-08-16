import Image from "next/image"


const CartActivity = ({}) => {
  return (
        <div className="bg-white w-full rounded-lg p-2 mt-3 py-3 flex items-center space-x-2">
            <div className="relative size-[4rem] bg-white">
                <Image className="object-cover" layout="fill" objectFit="contain" alt="image event" src="https://oreg.rmutt.ac.th/wp-content/uploads/2019/01/40275-Converted-01.png" />
            </div>
            <div className="">
            <h3 className="line-clamp-1 text-lg">เปิดโลกชวนชมรมเปิดบูธกิจกรรมนักศึกษา</h3>
            <p className="line-clamp-1">วันที่ 17-26 กรกฏาคม 2567 เวลา 12.00 -13.00</p>
            </div>
        </div>
       
  )}

export default CartActivity