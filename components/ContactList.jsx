import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const ContactList = ({ onSelectContact, onClose }) => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (session && session.user) {
      setCurrentUserId(session.user.uuid);
    }
  }, [session]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!currentUserId) return;
      try {
        const response = await axios.get(`/api/getContacts?userId=${currentUserId}`);
        console.log(`Fetching contacts for user: ${currentUserId}`);
        console.log('Response:', response.data);
        setContacts(response.data.contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error.response || error);
      }
    };

    fetchContacts();
  }, [currentUserId]);

  // ฟังก์ชันสำหรับกรองรายชื่อตามคำค้นหา
  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-[400px] h-[70%] bg-white shadow-lg rounded-lg overflow-hidden z-[200]">
      <div className="flex items-center justify-between p-4 bg-blue-500">
        <div className="flex space-x-2">
          <Image
            src="/assets/img_main/Chat.png"
            alt="Chat Icon"
            width={24}
            height={24}
            className="w-8 h-8"
          />
          <h2 className="text-white text-lg">Contacts</h2>
        </div>
        <div className="flex items-end h-full cursor-pointer" onClick={onClose}>
          <Image
            src="/assets/img_main/line.png"
            alt="Close"
            width={24}
            height={24}
            className="w-6 h-3"
          />
        </div>
      </div>
      <div className="w-full py-3">
        <form className="flex items-center max-w-sm mx-auto">
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 -6 44 44">
                <path d="M42 32H14.01a2 2 0 0 1-2-2v-2c0-.36.2-.7.52-.88l9.79-5.33c-3.28-3.55-3.32-8.56-3.32-8.8L19.01 7a1 1 0 0 1 .01-.16C19.72 2.75 24.22 0 28 0 31.8 0 36.3 2.75 37 6.83L37 7v6c0 .22-.03 5.24-3.3 8.79l9.78 5.33A1 1 0 0 1 44 28v2a2 2 0 0 1-2 2Zm-10.47-9.12a1 1 0 0 1-.16-1.65c3.6-2.92 3.64-8.18 3.64-8.24V7.1c-.57-3-4.13-5.08-7-5.08-2.88 0-6.44 2.08-7 5.08V13c0 .06.05 5.34 3.63 8.24a1 1 0 0 1-.16 1.65L14.01 28.6V30H42v-1.4l-10.47-5.72ZM18.65 2.52A7.42 7.42 0 0 0 16 2c-2.88 0-6.44 2.08-7 5.08v5.9c0 .06.05 5.34 3.63 8.24a1 1 0 0 1-.16 1.65L2 28.6v1.4h7a1 1 0 0 1 0 2H2a2 2 0 0 1-2-2v-2c0-.36.2-.7.52-.87l9.79-5.34c-3.28-3.55-3.32-8.56-3.32-8.8V7l.02-.16C7.71 2.74 12.21 0 16 0h.02c1.1 0 2.25.23 3.36.66a1 1 0 1 1-.72 1.86Z"/>
              </svg>
            </div>
            <input 
              type="text" 
              id="simple-search" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 focus:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Search contact..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>
      <div className="border p-3 space-y-3 h-full overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div 
            key={contact._id} 
            className="flex flex-row items-center border-b-2 border-gray-200 pb-2 cursor-pointer"
            onClick={() => onSelectContact(contact)}
          >
            <Image
              src={contact.profileImage || "/assets/img_main/usericon.png"}
              alt={`${contact.username} avatar`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col px-3 w-full">
              <div className="text-lg">{`${contact.firstname} ${contact.lastname}`}</div>
              <div className="text-sm text-gray-500">{contact.username}</div>
              <div className="text-xs text-gray-400">แสดงข้อความล่าสุด</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;