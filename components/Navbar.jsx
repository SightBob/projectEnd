"use client";

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";


const Navbar = ({}) => {

  const pathName = usePathname()
  const [ openMenu, setOpenMenu ] = useState(false);

  const { data: session} = useSession();
  const ClickOpenMenu = () => {
    setOpenMenu(!openMenu)
  } 

  useEffect(() => {
    setOpenMenu(false);

  }, [pathName]);

  const isActive = (path) => pathName === path ? "text-[#ff3300]" : "";

  return (
    <header className="bg-[rgba(255,255,255,0.5)] backdrop-blur-[20px] w-full fixed top-0 left-0 z-[100]  border border-solid border-[rgba(255,255,255,0.30)]">
      <nav className="container mx-auto flex justify-between items-center h-[7rem]">

        <Link href="/" className="flex items-center space-x-2">
        <div className="size-[5rem] relative">
          <Image
            layout="fill"
            src="/assets/img_main/logo.png"
          />
          </div>
          <h1 className="text-2xl">SUT EVENTS</h1>
        </Link>

        <div className={`flex space-x-8 max-xl:fixed max-xl:top-[7rem] max-xl:left-0 max-xl:w-full max-xl:bg-white max-xl:flex-col max-xl:items-center max-xl:space-x-0 max-xl:space-y-8 max-xl:transition-[height] duration-500 max-xl:overflow-hidden ${openMenu ? "max-sm:h-[470px] max-xl:h-[380px]" : "max-xl:h-[0px]" }  `}>
          <Link className={`text-lg max-xl:mt-[3rem] ${isActive("/")}`} href="/">หน้าหลัก</Link> 
          <Link className={`text-lg ${isActive("/sutevent")}`} href="/sutevent">กิจกรรม</Link>
          <Link className={`text-lg ${isActive("/searchgroup")}`} href="/searchgroup">ค้นหากลุ่ม</Link> 
          <Link className={`text-lg ${isActive("/favorites")}`} href="/favorites">รายการโปรด</Link>
          <Link className={`text-lg ${isActive("/post")}`} href="/post">โพสต์</Link>
          
          {!session ?(
            <>
            <div className="flex items-center space-x-8 sm:hidden">
          <Link href="login" className="px-6 cursor-pointer">
            <h2 className="text-lg">เข้าสู่ระบบ</h2>
          </Link>
          <Link href="register" className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer">
            <h2 href="" className="text-lg">สมัครสมาชิก</h2>
          </Link>
          </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-6 sm:hidden">
              <Link href="profile" className="px-6 cursor-pointer">
              <h2 className="text-lg">โปรไฟล์</h2>
            </Link>
            <Link href="" onClick={() => signOut()} className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer">
              <h2 className="text-lg">ออกจากระบบ</h2>
            </Link>
            </div>
          )}

        </div>

        <div className="flex items-center space-x-5">

        {!session ?(
            <>
          <Link href="login" className="cursor-pointer max-sm:hidden">
            <h2 className="text-lg">เข้าสู่ระบบ</h2>
          </Link>
          <Link href="register" className="bg-[#ff3300] px-8 rounded-full py-2 text-white cursor-pointer max-sm:hidden">
            <h2 className="text-lg">สมัครสมาชิก</h2>
          </Link>
            </>
          ) : (
            <div className="flex items-center space-x-2 max-sm:hidden">
            <Link href="profile" className="px-6 cursor-pointer">
              <h2 className="text-lg">โปรไฟล์</h2>
            </Link>
            <Link href="" onClick={() => signOut()} className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer">
              <h2 className="text-lg">ออกจากระบบ</h2>
            </Link>
            </div>
          )}




          {/* menu */}
          <div className="xl:hidden">
            <div className="size-9 relative cursor-pointer" onClick={ClickOpenMenu}>
            <Image
              layout="fill"
              src="/assets/img_main/menu.svg"
              alt=""
            />
            </div>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
