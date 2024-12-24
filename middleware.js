import { NextResponse } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // รายการ path ที่ต้องการให้เฉพาะ admin เข้าถึงได้
  const adminPaths = ['/dashboard', '/push-notification', '/post-activity','/report','/editBot','/editUser'];

  if (!token) {
    if (pathname.startsWith('/Interest')) {
      console.log("Redirecting to home because token is missing and pathname is /Interest");
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (adminPaths.some(path => pathname.startsWith(path))) {
      console.log("Redirecting to login because token is missing and trying to access admin path");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (token && token.verifyEmail !== true && !pathname.startsWith('/checkYourEmail')) {
    console.log("Redirecting to /checkYourEmail because verifyEmail is false");
  
    const redirectUrl = `/checkYourEmail?email=${token.email}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  else if (token && token.verify_categories === false && !pathname.startsWith('/Interest')) {
    console.log("Redirecting to /Interest because verify_categories is false");
    return NextResponse.redirect(new URL('/Interest', request.url));
  }

  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
      return NextResponse.redirect(new URL('/', request.url));
  }

  // ตรวจสอบสิทธิ์การเข้าถึง admin
  if (adminPaths.some(path => pathname.startsWith(path))) {
    console.log("Checking admin access");
    if (token.role !== 'admin') {
      console.log("Redirecting non-admin: ", token);
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log("Admin access granted");
  }

}

// อัปเดต matcher เพื่อให้ครอบคลุมเส้นทางที่ต้องการป้องกันทั้งหมด
export const config = {
  matcher: [
    // '/sutevent',
    '/',
    // '/login',
    // '/register',
    '/searchgroup',
    '/favorites',
    '/Interest',
    '/post',
    '/profile/:path*',
    '/dashboard/:path*',
    '/push-notification/:path*',
    '/post-activity/:path*',
    '/editBot/:path*'
  ],
}
