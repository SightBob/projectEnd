import Image from "next/image"

const Footer = ({}) => {
  return (
              <footer className="bg-black text-white py-[2rem] mt-6">
               <div className="container flex justify-between items-end max-lg:flex-col-reverse max-lg:items-center">
               <div>
                  <div className="flex justify-start space-x-8 max-lg:flex-col max-lg:items-center max-lg:mt-12 max-lg:space-y-5 max-lg:space-x-0">
                    <div className="bg-gray-100 p-2 rounded-lg">
                    <Image 
                      src="/assets/img_main/logo-full.png" 
                      width={250} 
                      height={250} 
                      className="object-contain" 
                      alt="Logo" 
                      priority 
                      style={{ objectFit: 'contain' }} // Use objectFit to maintain aspect ratio
                  />


                  </div>
                  </div>
                  <div className="mt-4 space-y-1 max-lg:text-center">
                    <p className="font-sans text-sm">111 มหาวิทยาลัยเทคโนโลยีสุรนารี <br />
                    ต.สุรนารี อ.เมือง จ.นครราชสีมา 30000 <br />
                    044-225789
                    </p>
                  </div>
                </div>    
                <div className="flex text-xs max-lg:w-[300px] max-lg:flex-wrap max-lg:justify-center">
                  <div className="max-lg:w-[40%] max-lg:text-center"><p className="font-sans">หน้าหลัก</p></div>
                  <div className="h-[13px] mx-[28px] border"></div>
                  <div className="max-lg:w-[40%] max-lg:text-center"><p className=" font-sans">กิจกรรม</p></div>
                  <div className="h-[13px] mx-[28px] border max-lg:hidden"></div>
                  <div className="max-lg:mt-3"><p className=" font-sans">โพสต์</p></div>
                </div>   
                </div>      
              </footer>
  )
}

export default Footer