"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import axios from 'axios';
const Navbar = ({ toggleChat }) => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const { data: session } = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [unreadPersonCount, setUnreadPersonCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const processedNotifications = useRef(new Set());

  const toggleNotificationPopup = () => {
    setIsNotificationPopupOpen(!isNotificationPopupOpen);
  };

  const ClickOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  useEffect(() => {
    setOpenMenu(false);
  }, [pathName]);

  useEffect(() => {
    if (session && session.user) {
      setCurrentUserId(session.user.uuid);
    }
  }, [session]);

  useEffect(() => {
    const fetchUnreadPersonCount = async () => {
      try {
        const response = await axios.get("/api/getContacts?userId=" + session?.user.uuid);
        setUnreadPersonCount(response.data.unreadPersonCount);
      } catch (error) {
        console.error('Error fetching unread person count:', error);
      }
    };
      fetchUnreadPersonCount();
  }, [session]);
  
  useEffect(() => {

    const fetchUnreadNotifications = async () => {
      if (session) {
        const url = `/api/notifications?userId=${session?.user?.uuid}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();
  
          const now = new Date();
  
          const filteredNotifications = data.filter(notification => 
            new Date(notification.scheduledTime) <= now
          );
  
          console.log("filteredNotifications:", filteredNotifications);

          let validNotifications = [];

          for (const notification of filteredNotifications) {

            const notificationKey = `${notification.postId}-${session.user.uuid}`;

            if (notification.type === 'auto') {
              if (notification.participants.includes(session?.user?.uuid)) {

              console.log("have user:", notification);

              if(!notification.sendEmail.includes(session?.user?.uuid) && !processedNotifications.current.has(notificationKey)){
              
              processedNotifications.current.add(notificationKey);

              const userResponse = await axios.get(`/api/data/getUser?id=${session?.user?.uuid}`);
              
              console.log('getUser: ', userResponse.data);

              // ส่งเมล
              await fetch('/api/sendEventReminder', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: userResponse.data.email,
                  title: notification.title,
                  message: notification.message,
                  userId: userResponse.data.id,
                  postId: notification.postId,
                }),
              });
              }

              validNotifications.push(notification);

              }
            }

            if (notification.type === 'manual') {
              validNotifications.push(notification);
            }
          }
          console.log("validNotifications:", validNotifications);
          
          // จัดเรียงการแจ้งเตือนตาม scheduledTime
          setNotifications(validNotifications.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime)));
  
          // คำนวณจำนวนการแจ้งเตือนที่ยังไม่ได้อ่าน
          setUnreadNotifications(validNotifications.filter(notification => !notification.readed.includes(session.user.uuid)).length);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };
    fetchUnreadNotifications();
  }, [session]);

  const isActive = (path) => (pathName === path ? "text-[#ff3300]" : "");

  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationIcon = document.querySelector(".notification-icon");
      const popup = document.querySelector(".notification-popup");
  
      if (popup && notificationIcon && !popup.contains(event.target) && !notificationIcon.contains(event.target)) {
        setIsNotificationPopupOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleExpand = async (notificationId) => {
    if (expandedNotificationId === notificationId) {
      setExpandedNotificationId(null);
    } else {
      setExpandedNotificationId(notificationId);

      const notification = notifications.find(notification => notification._id === notificationId);
      if (!notification?.readed.includes(session?.user?.uuid)) {
        try {
          const response = await fetch(`/api/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.uuid }),
          });

          const updatedNotification = await response.json();

          if (response.ok) {
            setNotifications(prev =>
              prev.map(noti =>
                noti._id === notificationId
                  ? { ...noti, readed: [...noti.readed, session?.user?.uuid] }
                  : noti
              )
            );
            // Decrease unread count since the notification is now read
            setUnreadNotifications(prev => prev - 1);
          } else {
            console.error('Error updating notification:', updatedNotification.error);
          }
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }
    }
  };

  const NotificationItem = ({ notification, isExpanded, onToggleExpand }) => {
    const { data: session } = useSession();
    const isReadByUser = notification.readed.includes(session?.user?.uuid);
  
    const handleToggleExpand = async () => {
      onToggleExpand(notification._id);
  
      if (!isReadByUser) {
        try {
          await fetch(`/api/notifications/${notification._id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session?.user?.uuid }),
          });
  
          notification.readed.push(session?.user?.uuid);
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }
    };
  
    return (
      <li className={`py-2 text-lg ${isReadByUser ? 'text-gray-500' : 'text-black'}`}>
        <div className="flex justify-between items-center">
          <span onClick={handleToggleExpand} className="cursor-pointer max-sm:text-sm">
            {notification.title}
            <span className="text-gray-500 ml-2  max-sm:text-sm">
              {new Date(notification.scheduledTime).toLocaleDateString('th-TH', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </span>
        </div>
  
        {isExpanded && (
          <div className="mt-2">
            <p>{notification.message}</p>
          </div>
        )}
      </li>
    );
  };

  return (
    <header className="bg-[rgba(255,255,255,0.5)] backdrop-blur-[20px] w-full fixed top-0 left-0 z-[100] border border-solid border-[rgba(255,255,255,0.30)]">
      <nav className="container mx-auto flex justify-between items-center h-[7rem]">
        <Link href="/" className="flex items-center space-x-2">
          <div className="size-[5rem] max-[460px]:size-[3.5rem] relative">
            <Image
              src="/assets/img_main/logo.png"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Logo"
              priority
            />
          </div>
          <h1 className="text-2xl max-sm:text-lg">SUT EVENTS</h1>
        </Link>

        <div
          className={`flex space-x-8 max-xl:fixed max-xl:top-[7rem] max-xl:left-0 max-xl:w-full max-xl:bg-white max-xl:flex-col max-xl:items-center max-xl:space-x-0 max-xl:space-y-8 max-xl:transition-[height] duration-500 max-xl:overflow-hidden ${
            openMenu ? "max-sm:h-[470px] max-xl:h-[380px]" : "max-xl:h-[0px]"
          }`}
        >
          <Link
            className={`text-lg max-xl:mt-[3rem] ${isActive("/")}`}
            href={session?.user?.role === "admin" ? "/dashboard" : "/"}
          >
            {session?.user?.role === "admin" ? "แดชบอร์ด" : "หน้าหลัก"}
          </Link>
          <Link
            className={`text-lg ${isActive("/sutevent")}`}
            href={session?.user?.role === "admin" ? "/post-activity" : "/sutevent"}
          >
            กิจกรรม
          </Link>
          <Link
            className={`text-lg ${isActive("/searchgroup")}`}
            href={session?.user?.role === "admin" ? "/push-notification" : "/searchgroup"}
          >
            {session?.user?.role === "admin" ? "การแจ้งเตือน" : "ค้นหากลุ่ม"}
          </Link>
          {session?.user?.role === "admin" && (
            <>
              <Link className={`text-lg ${isActive("/editBot")}`} href="/editBot">
                แชทบอท
              </Link>
               <Link
            className={`text-lg ${isActive("/sutevent")}`}
            href={session?.user?.role === "admin" ? "/report" : "/sutevent"}
          >
            รายงาน
          </Link>
          <Link className={`text-lg ${isActive("/editUser")}`} href="/editUser">
                จัดการผู้ใช้
              </Link>
            </>
            
          )}
          {session?.user?.role !== "admin" && (
            <>
              <Link className={`text-lg ${isActive("/favorites")}`} href="/favorites">
                รายการโปรด
              </Link>
              <Link className={`text-lg ${isActive("/post")}`} href="/post">
                โพสต์
              </Link>
            </>
          )}
          {!session ? (
            <div className="flex items-center space-x-8 sm:hidden">
              <Link href="/login" className="px-6 cursor-pointer">
                <h2 className="text-lg">เข้าสู่ระบบ</h2>
              </Link>
              <Link
                href="/register"
                className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer"
              >
                <h2 className="text-lg">สมัครสมาชิก</h2>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 sm:hidden">
              <Link href="/profile" className="px-6 cursor-pointer">
                <h2 className="text-lg">โปรไฟล์</h2>
              </Link>
              {/* <Link
                href=""
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer"
              >
                <h2 className="text-lg">ออกจากระบบ</h2>
              </Link> */}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-5">
          {!session ? (
            <>
              <Link href="/login" className="cursor-pointer max-sm:hidden">
                <h2 className="text-lg">เข้าสู่ระบบ</h2>
              </Link>
              <Link
                href="/register"
                className="bg-[#ff3300] px-8 rounded-full py-2 text-white cursor-pointer max-sm:hidden"
              >
                <h2 className="text-lg">สมัครสมาชิก</h2>
              </Link>

              <div className="flex xl:hidden" onClick={ClickOpenMenu}>
              <div className={`text-black ${openMenu ? "open" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="size-8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
              </div>
            </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="relative">
              <img
                src="/assets/img_main/Chat.png"
                alt="Chat Icon"
                className="size-[50px] max-[460px]:size-[33px] cursor-pointer"
                onClick={toggleChat}
              />
               {unreadPersonCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-center flex items-center justify-center max-[460px]:-top-1.5 max-[460px]:-right-1.5 max-[460px]:w-5 max-[460px]:h-5 max-[460px]:text-[12px]">
                  {unreadPersonCount}
                </span>
              )}
              </div>
              {/* Notification Icon */}
              <div className="relative">
              <img
                  src="/assets/img_main/Notification.png"
                  alt="Notification Icon"
                  className="size-[44px] max-[460px]:size-[30px] cursor-pointer notification-icon"
                  onClick={toggleNotificationPopup}
                />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-center flex items-center justify-center max-[460px]:-top-1.5 max-[460px]:-right-1.5 max-[460px]:w-5 max-[460px]:h-5 max-[460px]:text-[12px]">
                    {unreadNotifications}
                  </span>
                )}
                {isNotificationPopupOpen && (
                  <div className="absolute right-0 mt-2 w-[35rem] max-md:w-[27rem] max-sm:w-[85vw] max-[460px]:w-[92vw] max-[460px]:right-[-2.5rem] bg-white border border-gray-200 shadow-lg rounded-lg z-50 p-4 notification-popup">
                    <h3 className="text-lg font-bold max-sm:text-[16px]">การเเจ้งเตือน</h3>
                    <ul className="max-h-[200px] h-full overflow-y-scroll">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification._id}
                          notification={notification}
                          isExpanded={expandedNotificationId === notification._id}
                          onToggleExpand={toggleExpand}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Link href="/profile" className="px-6 cursor-pointer max-sm:hidden">
                <h2 className="text-lg">โปรไฟล์</h2>
              </Link>
              {/* <Link
                href=""
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer max-sm:hidden"
              >
                <h2 className="text-lg">ออกจากระบบ</h2>
              </Link> */}
            <div className="flex xl:hidden" onClick={ClickOpenMenu}>
              <div className={`text-black ${openMenu ? "open" : ""}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" className="size-8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
              </div>
            </div>
            </div>
          )}
        </div>

      </nav>
    </header>
  );
};

export default Navbar;