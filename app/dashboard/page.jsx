"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/getdata'); // Adjust the endpoint as necessary
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/getUsers'); // Adjust the endpoint as necessary
        setTotalUsers(response.data.totalUsers || 0); // Set total users from response
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchPosts();
    fetchUsers();
  }, []);

  const totalActivities = posts.length; // Count total activities based on posts

  // Calculate posts count for each month
  const monthlyPostCounts = Array(12).fill(0); // Initialize an array for 12 months

  posts.forEach(post => {
    const postDate = new Date(post.created_at); // Use created_at date
    const month = postDate.getMonth(); // Get month (0-11)
    monthlyPostCounts[month] += 1; // Increment the count for the corresponding month
  });

  const now = new Date();
  const recentPosts = posts.filter(post => {
    const postDate = new Date(post.start_date); // Adjust according to your date field
    return (now - postDate) <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  });

  const newPostsCount = recentPosts.length; // Count of new posts

  const barData = {
    labels: ['ม.ค','ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    datasets: [
      {
        label: 'กิจกรรมที่จัดขึ้น',
        data: monthlyPostCounts, // Use the calculated monthly counts
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
  };

  const pieData = {
    labels: ['อาหาร', 'เกม', 'กีฬา'],
    datasets: [
      {
        label: 'Top 3 สิ่งที่คุณสนใจมากที่สุด',
        data: [60, 30, 10], // Adjust data as needed
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 25,
      },
    },
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          <h2 className="text-2xl">ผู้ใช้งานปัจจุบัน</h2>
          <p className="text-4xl font-bold">0</p>
          <p className="text-sm text-gray-500">จำนวนผู้ใช้งานออนไลน์</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">กิจกรรมใหม่ล่าสุด</h2>
          <p className="text-4xl font-bold">{newPostsCount}</p> {/* Display new posts count */}
          <p className="text-sm text-gray-500">โพสต์ภายใน 24 ชั่วโมง</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">ผู้ใช้งานทั้งหมด</h2>
          <p className="text-4xl font-bold">{totalUsers}</p> {/* Display total users */}
          <p className="text-sm text-gray-500">ข้อมูลผู้ใช้งานทั้งหมดในเว็บ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">กิจกรรมทั้งหมด</h2>
          <p className="text-4xl font-bold">{totalActivities}</p> {/* Display total activities */}
          <p className="text-sm text-gray-500">กิจกรรมทั้งหมดในเว็บ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 relative">
          <select className="absolute top-4 right-4 bg-gray-200 p-2 rounded ">
            <option>2024</option>
            <option>2025</option>
            <option>2026</option>
          </select>
          <h3 className="text-xl font-semibold mb-4">แสดงจำนวนกิจกรรมที่จัดขึ้นในแต่ละเดือนของปี 2024</h3>
          <div className="w-full h-60 md:h-80 lg:h-120 flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">กล่องใหม่</h3>
          <p>เนื้อหาของกล่องนี้</p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Top 3 สิ่งที่คุณสนใจมากที่สุด</h3>
          <div className="w-full h-64 md:h-104 lg:h-120 flex items-center justify-center ">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Latest Events Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl md:text-2xl font-semibold mb-4">กิจกรรมใหม่ล่าสุด</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xl font-medium">ID</th>
                <th className="px-6 py-3 text-left text-xl font-medium">ชื่อผู้ใช้</th>
                <th className="px-6 py-3 text-left text-xl font-medium">ชื่อกิจกรรม</th>
                <th className="px-6 py-3 text-left text-xl font-medium">เวลา</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map(post => {
                const user = users.find(user => user._id === post.organizer_id);
                return (
                  <tr key={post._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{post._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{user ? user.username : 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">{`${post.start_date} ${post.start_time}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;