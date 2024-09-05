"use client";

const PostActivity = () => {
  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">จัดการกิจกรรม</h1>

      <div className="flex justify-between items-center mb-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add new</button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2">ชื่อผู้ใช้</th>
              <th className="px-4 py-2">ชื่อกิจกรรม</th>
              <th className="px-4 py-2">เวลา</th>
              <th className="px-4 py-2">สถานที่</th>
              <th className="px-4 py-2">รายละเอียด</th>
              <th className="px-4 py-2">รูปภาพ</th>
              <th className="px-4 py-2">link form</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2">Eren Yeager</td>
              <td className="border px-4 py-2">Badminton Summer Camp</td>
              <td className="border px-4 py-2">7/8/2567 08:21</td>
              <td className="border px-4 py-2">อาคารเรียนรวม 1</td>
              <td className="border px-4 py-2">ช่วยเสริมสร้างสุขภาพ</td>
              <td className="border px-4 py-2">image.png</td>
              <td className="border px-4 py-2">https://formlink.com</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2">Armin Aler</td>
              <td className="border px-4 py-2">มาส. จัดกิจกรรม...</td>
              <td className="border px-4 py-2">7/8/2567 09:30</td>
              <td className="border px-4 py-2">อาคารเรียนรวม 2</td>
              <td className="border px-4 py-2">ส่งเสริมการอบรม...</td>
              <td className="border px-4 py-2">image.png</td>
              <td className="border px-4 py-2">https://formlink.com</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2">Reiner Braun</td>
              <td className="border px-4 py-2">SUT Act Fest 2023</td>
              <td className="border px-4 py-2">7/8/2567 10:30</td>
              <td className="border px-4 py-2">อาคารฝึกงานบัณฑิต</td>
              <td className="border px-4 py-2">สร้างงานจากสาขา...</td>
              <td className="border px-4 py-2">image.png</td>
              <td className="border px-4 py-2">https://formlink.com</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2">Bertolt Hoover</td>
              <td className="border px-4 py-2">พิธีมอบเกียรติบัตร...</td>
              <td className="border px-4 py-2">7/8/2567 11:56</td>
              <td className="border px-4 py-2">อาคารรุ่นพี่</td>
              <td className="border px-4 py-2">พัฒนานักศึกษาทำงาน...</td>
              <td className="border px-4 py-2">image.png</td>
              <td className="border px-4 py-2">https://formlink.com</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">
                <input type="checkbox" />
              </td>
              <td className="border px-4 py-2">Annie Leonhardt</td>
              <td className="border px-4 py-2">กิจกรรมบันทึกฝึก...</td>
              <td className="border px-4 py-2">7/8/2567 16:33</td>
              <td className="border px-4 py-2">อาคารรุ่นพัฒนาที่ 2</td>
              <td className="border px-4 py-2">เพิ่มเติมเกี่ยวกับ...</td>
              <td className="border px-4 py-2">image.png</td>
              <td className="border px-4 py-2">https://formlink.com</td>
              <td className="border px-4 py-2 text-center">
                <button className="bg-green-500 text-white px-2 py-1 rounded-lg">Edit</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostActivity;