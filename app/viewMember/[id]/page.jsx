'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

const ViewMember = ({ params }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/data/getMember/?id=${params.id}`);
        if (response.data && response.data.event) {
          const participantIds = response.data.event.participants;
          const participantsData = await Promise.all(
            participantIds.map(async (id) => {
              const userResponse = await axios.get(`/api/data/getUser/?id=${id}`);
              return userResponse.data;
            })
          );
          setParticipants(participantsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">รายชื่อผู้เข้าร่วม</h1>
      {participants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participants.map((participant, index) => (
            <div key={participant.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300">
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold text-blue-500 mr-3">{index + 1}</span>
                <h2 className="text-xl font-semibold">{participant.firstname} {participant.lastname}</h2>
              </div>
              <p className="text-gray-600"><span className="font-medium">Username:</span> {participant.username}</p>
              <p className="text-gray-600"><span className="font-medium">Email:</span> {participant.email}</p>
              <p className="text-gray-600"><span className="font-medium">Major:</span> {participant.major}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl">ไม่มีผู้เข้าร่วมในขณะนี้</p>
      )}
      <div className="mt-8 text-center">
        <Link 
          href={`/post`} 
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 text-lg font-semibold"
        >
          กลับไปหน้าแก้ไขกิจกรรม
        </Link>
      </div>
    </div>
  );
};

export default ViewMember;