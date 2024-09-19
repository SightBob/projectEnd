import { NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // รายการ path ที่ต้องการให้เฉพาะ admin เข้าถึงได้
  const adminPaths = ['/dashboard', '/push-notification', '/post-activity'];

  // ตรวจสอบว่าเป็นหน้าที่ต้องการให้เฉพาะ admin เข้าถึงได้หรือไม่
  if (adminPaths.some(path => pathname.startsWith(path))) {
    console.log("Checking admin access");
    // ถ้าไม่มี token หรือ role ไม่ใช่ admin ให้ redirect ไปหน้าหลัก
    if (!token || token.role !== 'admin') {
      console.log("Redirecting non-admin");
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log("Admin access granted");
  }

  // ถ้าไม่เข้าเงื่อนไขข้างบน ให้เข้าถึงหน้าที่ต้องการได้ตามปกติ
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/push-notification/:path*',
    '/post-activity/:path*'
  ],
}