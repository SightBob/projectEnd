import Image from 'next/image';

const Page = () => {
  return (
    <div className='Container w-full flex justify-center items-center h-[calc(100vh_-_8rem)]'>
      <div className="max-w-7xl h-full w-full mx-6 p-6 bg-white shadow-md rounded-lg">
        {/* Cover Image Container */}
        <div className="relative mb-10">
          <div 
            className="h-52 w-full bg-cover bg-center rounded-lg" 
            style={{ backgroundImage: "url('/assets/img_main/cover-cat.png')" }} // ใส่ path รูป cover ที่นี่
            ></div>
          <div className="absolute left-10 bottom-[-80px] flex items-center">
            
             <div className="size-[8rem] relative">
          <Image
            layout="fill"
            src="/assets/img_main/Profile-cat.png"
            className="rounded-full border-4 border-white object-cover"
          />
          </div>
            <div className="ml-5">
              <h1 className="text-2xl font-bold">Username</h1>
              {/* <h1 className="text-2xl font-bold">{user.username}</h1> */}
            </div>
          </div>
        </div>

        <div className="space-y-10 mt-28 px-10 pr-56">
          <div className="flex justify-between items-center">
            <span>ชื่อผู้ใช้</span>
            <span>Username</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>ชื่อจริง</span>
            <span>firstName</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>นามสกุล</span>
            <span>lastName</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>อีเมล</span>
            <span>email</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>รหัสผ่าน</span>
            <span>password</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>คณะ</span>
            <span>faculty</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
          <div className="flex justify-between items-center">
            <span>สาขาวิชา</span>
            <span>department</span>
            <button className="text-blue-500 hover:underline">Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
