"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { format } from 'date-fns';

const Navbar = ({ toggleChat }) => {
  const pathName = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const { data: session } = useSession();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationPopupOpen, setIsNotificationPopupOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);

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
    const fetchUnreadNotifications = async () => {
      if (session) {
        const url = `/api/notifications?userId=${session.user.id}`; // สร้าง URL ที่มี userId
        console.log('Fetching URL:', url); // ตรวจสอบว่ามี userId ใน URL
  
        try {
          const response = await fetch(url);
          const data = await response.json();
          
          setNotifications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          setUnreadNotifications(data.filter(notification => !notification.isRead).length);
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
      if (!event.target.closest(".notification-popup")) {
        setIsNotificationPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      setUnreadNotifications(prev => prev - 1);
      setNotifications(prev => 
        prev.map(notification =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      setUnreadNotifications(prev => prev - 1);
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const toggleExpand = (notificationId) => {
    if (expandedNotificationId === notificationId) {
      setExpandedNotificationId(null);
    } else {
      setExpandedNotificationId(notificationId);
      if (notifications.find(notification => notification._id === notificationId)?.isRead === false) {
        markAsRead(notificationId);
      }
    }
  };

  const NotificationItem = ({ notification, isExpanded, onToggleExpand }) => {
    return (
      <li className="py-2 text-lg">
        <div className="flex justify-between items-center">
          <span onClick={() => onToggleExpand(notification._id)} className="cursor-pointer">
            {notification.title}
            <span className="text-gray-500 ml-2">
              {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
            </span>
          </span>
  
          <div>
            <button onClick={() => deleteNotification(notification._id)}>
              <img src="/assets/img_main/trash-icon.png" alt="Delete" className="w-5 h-5" />
            </button>
          </div>
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
          <div className="size-[5rem] relative">
            <Image
              src="/assets/img_main/logo.png"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Logo"
            />
          </div>
          <h1 className="text-2xl max-sm:text-sm">SUT EVENTS</h1>
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
              <img src="/assets/img_main/Chat.png" alt="Chat Icon" className="w-6 h-6" />
              <Link href="/profile" className="px-6 cursor-pointer">
                <h2 className="text-lg">โปรไฟล์</h2>
              </Link>
              <Link
                href=""
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer"
              >
                <h2 className="text-lg">ออกจากระบบ</h2>
              </Link>
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
            </>
          ) : (
            <div className="flex items-center space-x-2 max-sm:hidden">
              <img
                src="/assets/img_main/Chat.png"
                alt="Chat Icon"
                className="w-[50px] h-[50px] cursor-pointer"
                onClick={toggleChat}
              />

              {/* Notification Icon */}
              <div className="relative">
                <img
                  src="/assets/img_main/Notification.png"
                  alt="Notification Icon"
                  className="w-[50px] h-[50px] cursor-pointer"
                  onClick={toggleNotificationPopup}
                />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 text-center">
                    {unreadNotifications}
                  </span>
                )}
                {isNotificationPopupOpen && (
                  <div className="absolute right-0 mt-2 w-[40rem] bg-white border border-gray-200 shadow-lg rounded-lg z-50 p-4 notification-popup">
                    <h3 className="text-lg font-bold">การเเจ้งเตือน</h3>
                    <ul>
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

              <Link href="/profile" className="px-6 cursor-pointer">
                <h2 className="text-lg">โปรไฟล์</h2>
              </Link>
              <Link
                href=""
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-[#ff3300] px-6 rounded-full py-2 text-white cursor-pointer"
              >
                <h2 className="text-lg">ออกจากระบบ</h2>
              </Link>
            </div>
          )}
        </div>

        <div className="flex sm:hidden" onClick={ClickOpenMenu}>
          <div className={`menu-btn ${openMenu ? "open" : ""}`}>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
            <span className="menu-bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;