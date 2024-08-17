import CartInterest from "@/components/CartInterest"
import Link from "next/link";

const titleInterest = [
    { name: "อาหาร", img: "food" },
    { name: "เกม", img: "game" },
    { name: "ชมรมนักศึกษา", img: "club" },
    { name: "กีฬา", img: "sport" },
    { name: "การศึกษา", img: "study" },
    { name: "ท่องเที่ยว", img: "travel" },
  ];

const Page = ({}) => {
  return (<div className="min-h-[calc(100vh_-_8rem)] w-full pb-[3rem]"> 
    <div className="max-w-[560px] max-sm:w-[80%] mx-auto relative flex items-center justify-center">
    <h2 className="text-center text-3xl">สิ่งที่คุณสนใจ</h2>
    <Link href="" className="text-gray-400 absolute right-0">ข้าม</Link>
    </div>
    <div className="flex justify-center w-fit max-sm:w-[90%] mx-auto mt-4">
        <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-2">
        {titleInterest.map((interest, index) => (
            <CartInterest key={index} title={interest.name} name_img={interest.img} />
        ))}
        </div>
    </div>
    <div className="bg-[#FD8D64] px-12 mt-4 py-2 rounded-md w-fit mx-auto text-white cursor-pointer">
          <p>ถัดไป</p>
        </div>
  </div>)
}

export default Page