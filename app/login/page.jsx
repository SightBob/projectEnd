import Image from "next/image"
import Link from "next/link"

const Page = ({}) => {
  return (
  <div className="w-full flex h-[calc(100vh_-_8rem)] ">
    <div className="w-[50%] bg-white flex flex-col items-center justify-center max-md:w-full">
        <h2 className="text-3xl  text-center">เข้าสู่ระบบ</h2>
        <form action="" className="max-w-[300px] w-full mx-auto mt-6 flex flex-col">
            <label htmlFor="">ชื่อผู้ใช้ หรือ อีเมล</label>
            <input className="mt-2 border rounded-md max-w-[300px] py-1 w-full" type="text" />
            <label className="mt-5" htmlFor="">รหัสผ่าน</label>
            <input className="border rounded-md max-w-[300px] py-1 w-full" type="text" />
            <Link className="self-end text-[#EBB557] text-sm" href="">ลืมรหัสผ่าน?</Link>
            <input className="bg-[#FD8D64] py-2 w-full rounded-md text-white mt-4" type="submit" value="ล็อคอิน" />
            <p className="mt-2 self-end">ยังไม่มีบัญชีผู้ใช้ <Link className=" text-[#EBB557]" href="">สมัครสมาชิกที่นี่</Link></p>
        </form>
        
    </div>
    <div className="w-[50%] bg-[#FFDDD0] h-[calc(100vh_-_8rem)] max-md:hidden">
         <div className="w-auto h-[7rem] relative top-[50%] translate-y-[-50%]">
            <Image
                layout="fill"
                src="/assets/img_main/logo-full.png"
                className="object-contain"
            />
          </div>
    </div>
  </div>
  )}

export default Page