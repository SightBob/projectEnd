"use client";

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
  const barData = {
    labels: ['ม.ค','ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    datasets: [
      {
        label: 'กิจกรรมที่จัดขึ้น',
        data: [6,12, 19, 3, 5, 2, 3, 10, 15, 22, 13, 7],
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
        data: [60, 30, 10],
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
    scales: {
      x: {
        ticks: {
          padding: 10, // Add padding to the X scale labels
        },
      },
    },
  };
  return (
    <div className="p-8 space-y-8 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          <h2 className="text-2xl">ผู้ใช้งานปัจจุบัน</h2>
          <p className="text-4xl font-bold">345</p>
          <p className="text-sm text-gray-500">จำนวนผู้ใช้งานออนไลน์</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">กิจกรรมใหม่ล่าสุด</h2>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-gray-500">โพสต์ภายใน 24 ชั่วโมง</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">ผู้ใช้งานทั้งหมด</h2>
          <p className="text-4xl font-bold">567</p>
          <p className="text-sm text-gray-500">ข้อมูลผู้ใช้งานทั้งหมดในเว็บ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl">กิจกรรมทั้งหมด</h2>
          <p className="text-4xl font-bold">66</p>
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

        {/* Red Border Box */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ไอดีผู้ใช้</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อกิจกรรม</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">เวลา</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#0645499</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Eren Yeager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Badminton Summer Camp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7/8/2567 08:21</td>
              </tr>
          
            </tbody>
            <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#0645499</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Eren Yeager</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Badminton Summer Camp</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7/8/2567 08:21</td>
              </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
