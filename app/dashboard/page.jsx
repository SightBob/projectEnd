"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
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

const faculties = [
  "สำนักวิชาศาสตร์และศิลป์ดิจิทัล",
  'สำนักวิชาวิทยาศาสตร์',
  'สำนักวิชาเทคโนโลยีสังคม',
  'สำนักวิชาเทคโนโลยีการเกษตร',
  'สำนักวิชาแพทยศาสตร์',
  'สำนักวิชาพยาบาลศาสตร์',
  'สำนักวิชาวิศวกรรมศาสตร์',
  'สำนักวิชาทันตแพทยศาสตร์',
  'สำนักวิชาสาธารณสุขศาสตร์',
];

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [monthlyActivityData, setMonthlyActivityData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // current page state
  const itemsPerPage = 5; // number of items per page
  const popularPosts = posts.sort((a, b) => b.views - a.views).slice(0, 5); // เรียงโพสต์ตามยอด views และแสดงเพียง 5 อันดับแรก
  const [facultyCounts, setFacultyCounts] = useState([]);
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/getdata');
        const postData = response.data;
        setPosts(postData);
        
        const monthCounts = Array(12).fill(0);
        postData.forEach(post => {
          const postDate = new Date(post.start_date);
          if (postDate.getFullYear() === parseInt(selectedYear)) {
            const monthIndex = postDate.getMonth();
            monthCounts[monthIndex]++;
          }
        });
        
        setMonthlyActivityData(monthCounts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    

    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/getUsers');
        const usersData = response.data.users || [];
        setUsers(usersData);
        setTotalUsers(response.data.totalUsers || 0);
    
        const counts = { male: 0, female: 0 };
        usersData.forEach(user => {
          if (user.gender === 'ชาย') counts.male++;
          else if (user.gender === 'หญิง') counts.female++;
          else counts.other++;
        });
    
        setGenderCounts(counts);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    

    const fetchFacultyData = async () => {
      try {
        const response = await axios.get('/api/getUsers'); // API ที่ดึงข้อมูลผู้ใช้
        const users1 = response.data.users || [];
        console.log("Users Data:", users1);
        console.log("faculties Data:", faculties);
        setUsers(users1);
        
        const counts = faculties.map(faculty => 
          users1.filter(user => user.faculty === faculty).length
        );
        console.log("number Counts:", counts); // Debug: Log the calculated faculty counts
    
        setFacultyCounts(counts);
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      }
    };
    

    fetchFacultyData();
    fetchPosts();
    fetchUsers();
  }, [selectedYear]);

 const handleYearChange = (e) => {
  const year = e.target.value;
  setSelectedYear(year);


  
};


  const barFaculty = {
    labels: faculties,
    datasets: [
      {
        label: 'จำนวนผู้ใช้ต่อสำนักวิชา',
        data: facultyCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const barFacultyOptions = {
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

  
  const totalActivities = posts.length; // Count total activities based on posts
// Pagination Logic
const totalPages = Math.ceil(posts.length / itemsPerPage); // Calculate total pages correctly

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

// Pagination Logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentPosts = posts
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // เรียงจากใหม่ไปเก่าโดยใช้ created_at
  .slice(indexOfFirstItem, indexOfLastItem); // Slice สำหรับหน้าปัจจุบัน



  // Calculate posts count for each month
  const monthlyPostCounts = Array(12).fill(0); // Initialize an array for 12 months

  posts.forEach(post => {
    const postDate = new Date(post.start_date); // Use created_at date
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
    datasets: [{
      label: `Activities in ${selectedYear}`,
      data: monthlyActivityData,
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
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
  const categoryLabels = ['อาหาร', 'เกม', 'ชมรมนักศึกษา', 'กีฬา', 'การศึกษา', 'ท่องเที่ยว'];
  const categoryCounts = Array(categoryLabels.length).fill(0); // สร้างอาเรย์นับหมวดหมู่
  
  posts.forEach(post => {
    post.category.forEach(cat => {
      const index = categoryLabels.indexOf(cat);
      if (index !== -1) {
        categoryCounts[index] += 1; // เพิ่มจำนวนโพสต์ในหมวดหมู่ที่เจอ
      }
    });
  });
  

  const titleInterest = [
    { name: "อาหาร", img: "food", alt: "ไอคอนอาหาร" },
    { name: "เกม", img: "game", alt: "ไอคอนจอยสติ๊ก" },
    { name: "ชมรมนักศึกษา", img: "club", alt: "ไอคอนกลุ่มคน" },
    { name: "กีฬา", img: "sport", alt: "ไอคอนกีฬา" },
    { name: "การศึกษา", img: "study", alt: "ไอคอนหนังสือ" },
    { name: "ท่องเที่ยว", img: "travel", alt: "ไอคอนกระเป๋าเดินทาง" },
  ];
  

// Tally user preferences
const preferenceCounts = Array(titleInterest.length).fill(0);

users.forEach(user => {
  if (user.preferred_categories) {
    user.preferred_categories.forEach(preferred => {
      const index = titleInterest.findIndex(category => category.name === preferred);
      if (index !== -1) {
        preferenceCounts[index] += 1; // Count user preferences
      }
    });
  }
});




  
  const pieData = {
    labels: titleInterest.map(item => item.name), // Labels from titleInterest
    datasets: [
      {
        label: 'Top สิ่งที่ผู้ใช้งานสนใจ',
        data: preferenceCounts, // Data from tallying preferences
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
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
        top: 5,
      },
    },
  };




  const genderData = {
    labels: ['ชาย', 'หญิง'], // Include 'other' if applicable
    datasets: [{
      label: 'Gender Distribution',
      data: [genderCounts.male, genderCounts.female],
      backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
      borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
      borderWidth: 1,
    }],
  };
  
  
  

  const genderOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 5,
      },
    },
  };

  return (
    <div className="p-8 space-y-8 bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cards */}
        <div className="bg-white p-6 rounded-lg shadow-md relative">
          <h2 className="text-xl font-semibold">ผู้ใช้งานปัจจุบัน</h2>
          <p className="text-4xl font-bold">0</p>
          <p className="text-sm text-gray-500">จำนวนผู้ใช้งานออนไลน์</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">กิจกรรมใหม่ล่าสุด</h2>
          <p className="text-4xl font-bold">{newPostsCount}</p> {/* Display new posts count */}
          <p className="text-sm text-gray-500">โพสต์ภายใน 24 ชั่วโมง</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">ผู้ใช้งานทั้งหมด</h2>
          <p className="text-4xl font-bold">{totalUsers}</p> {/* Display total users */}
          <p className="text-sm text-gray-500">ข้อมูลผู้ใช้งานทั้งหมดในเว็บ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">กิจกรรมทั้งหมด</h2>
          <p className="text-4xl font-bold">{totalActivities}</p> {/* Display total activities */}
          <p className="text-sm text-gray-500 ">กิจกรรมทั้งหมดในเว็บ</p>
        </div>

        
     {/* กล่อง จำนวนสำนักวิชาของผู้ใช้งาน */}
  <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold">จำนวนสำนักวิชาของผู้ใช้งาน</h2>
    <div className="w-full h-60 md:h-80 lg:h-120 flex items-center justify-center">
      <Bar data={barFaculty} options={barFacultyOptions} />
    </div>
  </div>


  <div className="col-span-1 lg:col-span-2   grid grid-cols-1 lg:grid-cols-2 gap-8">
<div className="bg-white p-6 rounded-lg shadow-md ">
  <h2 className="text-xl font-semibold">กิจกรรมที่มีการกดถูกใจมากที่สุด</h2>
  <ul>
  {posts
    .filter(post => post.member === 'yes')
    .sort((a, b) => b.favorites.length - a.favorites.length)
    .slice(0, 5)
    .map(post => {
      const maxLength = 40; // กำหนดความยาวสูงสุดที่ต้องการ
      const title = post.title.length > maxLength ? `${post.title.slice(0, maxLength)}...` : post.title;
      return (
        <li key={post._id}>
          <Link href={`/page/${post._id}`} className="text-sm">
            {title} - กดถูกใจ {post.favorites.length} คน
          </Link>
        </li>
      );
    })}
</ul>

  <p className="text-sm text-gray-500 pt-2">นับจากยอดการกดใจ (Top 5 Favorites)</p>
</div>

{/* Popular Activities */}
<div className="bg-white p-6 rounded-lg shadow-md ">
<h2 className="text-xl font-semibold">กิจกรรมที่ได้รับความนิยม</h2>
<ul>
  {popularPosts.map(post => {
    const maxLength = 40; // กำหนดความยาวสูงสุดที่ต้องการ
    const title = post.title.length > maxLength ? `${post.title.slice(0, maxLength)}...` : post.title;
    return (
      <li key={post._id}>
        <Link href={`/page/${post._id}`} className="text-sm">
          {title} - {post.views} views
        </Link>
      </li>
    );
  })}
</ul>

  <p className="text-sm text-gray-500 pt-2">นับจากยอดผู้เข้าชม (Top 5 View)</p>
</div>

<div className="bg-white p-6 rounded-lg shadow-md ">
 
<h2 className="text-xl font-semibold">กิจกรรมที่มีสมาชิกผู้เข้าร่วมสูงสุด</h2>
<ul>
  {posts
    .filter(post => post.member === 'yes')
    .sort((a, b) => b.participants.length - a.participants.length) // เรียงตามจำนวนสมาชิกใน participants
    .slice(0, 10) // จำกัดผลลัพธ์แค่ 5 อันดับ
    .map(post => {
      const maxLength = 40; // กำหนดความยาวสูงสุดที่ต้องการ
      const title = post.title.length > maxLength ? `${post.title.slice(0, maxLength)}...` : post.title;
      return (
        <li key={post._id}>
          <Link href={`/page/${post._id}`} className="text-sm">
            {title} - สมาชิก {post.participants.length} คน
          </Link>
        </li>
      );
    })}
</ul>
  <p className="text-sm text-gray-500 pt-2">นับจากจำนวนสมาชิก (Top 10 Participants
  )</p>

</div>

<div className="bg-white p-6 rounded-lg shadow-md ">
  <h2 className="text-xl font-semibold">กลุ่มผู้ใช้งานตามเพศ</h2>
  <div className="w-full h-64 flex items-center justify-center">
          <Pie data={genderData} options={genderOptions} />
        </div>

</div>
      </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2 relative">
      <select className="absolute top-4 right-4 bg-gray-200 p-2 rounded" value={selectedYear} onChange={handleYearChange}>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
        <option value="2026">2026</option>
        
        {/* <option value="all">ทั้งหมด</option> */}
      </select>
      
      <h3 className="text-xl font-semibold mb-4">แสดงจำนวนกิจกรรมที่จัดขึ้นในแต่ละเดือนของปี {selectedYear}</h3>
      
      <div className="w-full h-60 md:h-80 lg:h-120 flex items-center justify-center">
        <Bar data={barData} options={barOptions} />
      </div>
    </div>

        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1">
  <h3 className="text-xl font-semibold mb-4">จำนวนโพสต์ตามหมวดหมู่</h3>
  <div className="w-full h-64 md:h-104 lg:h-120 flex items-center justify-center">
    <Pie 
      data={{
        labels: categoryLabels, 
        datasets: [
          {
            label: 'จำนวนโพสต์ในแต่ละหมวดหมู่',
            data: categoryCounts, 
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
          },
        ],
      }} 
      options={{
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
            top: 5,
          },
        },
      }}
    />
  </div>
</div>


        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-1">
          <h3 className="text-xl font-semibold mb-4">Top สิ่งที่คุณสนใจมากที่สุด</h3>
          <div className="w-full h-64 md:h-104 lg:h-120 flex items-center justify-center ">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Latest Events Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl md:text-xl font-semibold mb-4">กิจกรรมใหม่ล่าสุด</h3>
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
  {currentPosts.map(post => {
    const user = users.find(user => user._id === post.organizer_id);
    return (
      <tr
        key={post._id}
        onClick={() => window.location.href = `/page/${post._id}`} // Redirects on row click
        className="cursor-pointer hover:bg-gray-100" // Changes cursor and adds hover effect
      >
        <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
          {post._id}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
          {post.username}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
          {post.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
          {`${post.start_date} ${post.start_time}`}
        </td>
      </tr>
    );
  })}
</tbody>


          </table>
        </div>

    
        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded-lg border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;