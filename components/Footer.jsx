import Image from "next/image"

const Footer = ({}) => {
  return (
              <footer class="bg-black text-white py-[2rem] mt-6">
               <div className="container flex justify-between items-end max-lg:flex-col-reverse max-lg:items-center">
               <div>
                  <div class="flex justify-start space-x-8 max-lg:flex-col max-lg:items-center max-lg:mt-12 max-lg:space-y-5 max-lg:space-x-0">
                  <div className="bg-gray-100 p-2 rounded-lg">
                  <Image src="/assets/img_main/logo-full.png" width="250" height="250" />
                  </div>
                  </div>
                  <div class="mt-4 space-y-1 max-lg:text-center">
                    <p class="font-sans text-xs">©1997 by Eiichiro Oda/ SHUEISHA Inc.</p>
                    <p class="font-sans text-xs">©2022 by Eiichiro Oda, Gosho Aoyama/ SHUEISHA Inc.</p>
                    <p class="font-sans text-xs">©1997 EIICHIRO ODA</p>
                    <p class="font-sans text-xs">©1997 EIICHIRO ODA / 2008 NEW WORLD All Rights Reserved.</p>
                    <p class="font-sans text-xs">©1997 EIICHIRO ODA / 2019 WANO All Rights Reserved.</p>
                  </div>
                </div>    
                <div class="flex text-xs max-lg:w-[300px] max-lg:flex-wrap max-lg:justify-center">
                  <div class="max-lg:w-[40%] max-lg:text-center"><p class="font-sans">หน้าหลัก</p></div>
                  <div class="h-[13px] mx-[28px] border"></div>
                  <div class="max-lg:w-[40%] max-lg:text-center"><p class=" font-sans">กิจกรรม</p></div>
                  <div class="h-[13px] mx-[28px] border max-lg:hidden"></div>
                  <div class="max-lg:mt-3"><p class=" font-sans">โพสต์</p></div>
                </div>   
                </div>      
              </footer>
  )
}

export default Footer