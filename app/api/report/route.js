import Report from '@/models/Report';
import { dbConnect } from "@/lib/ConnectDB";
import { NextResponse } from "next/server";
import User from '@/models/User';

export async function POST(request) {
    await dbConnect(); // เชื่อมต่อกับฐานข้อมูลก่อน
  
    try {
      const { postId, userId, reason } = await request.json();
      
      console.log('Received report data:', { postId, userId, reason });

      // ตรวจสอบค่าที่จำเป็น
      if (!postId || !userId || !reason) {
        return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
      }

      // สร้างเอกสารการรายงานใหม่
      const newReport = new Report({
        postId,
        reportedBy: userId,
        reason
      });

      // บันทึกเอกสารรายงานลงในฐานข้อมูล
      await newReport.save();
  
      return NextResponse.json({ success: true, message: 'รายงานสำเร็จ', report: newReport });
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      return NextResponse.json({ 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 
        error: error.message || 'ไม่มีข้อมูล'
      }, { status: 500 });
    }
}

// เพิ่มฟังก์ชัน GET
export async function GET(request) {
  await dbConnect(); // เชื่อมต่อกับฐานข้อมูลก่อน

  try {
      const reports = await Report.find().populate('reportedBy'); // ค้นหารายงานทั้งหมดและ populate ฟิลด์ reportedBy ถ้ามี

      return NextResponse.json({ success: true, reports });
  } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      return NextResponse.json({
          success: false,
          message: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
          error: error.message || 'ไม่มีข้อมูล'
      }, { status: 500 });
  }
}
