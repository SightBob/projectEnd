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
  return (<div className="h-[calc(100vh_-_8rem)] w-full pb-12"> 
    <div className="max-w-[1180px] mx-auto relative flex items-center justify-center">
    <h2 className="text-center text-3xl">สิ่งที่คุณสนใจ</h2>
    <Link href="" className="text-gray-400 absolute right-0">ข้าม</Link>
    </div>
    <div className="grid grid-cols-4 gap-6 place-items-center max-w-[1200px] w-full mx-auto mt-6">
        {titleInterest.map((interest, index) => (
            <CartInterest key={index} title={interest.name} name_img={interest.img} />
        ))}
    </div>
  </div>)
}

export default Page