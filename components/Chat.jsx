import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Chatbot from './Chatbot'; // Import Chatbot component

const Chat = ({ contact, onBack, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const { data: session } = useSession();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the current chat is with a chatbot
  const isChatBot = contact._id === 'chatbot'; // Assuming chatbot has _id 'chatbot'

  useEffect(() => {
    if (session && session.user) {
      setCurrentUserId(session.user.uuid);
    }
  }, [session]);

  const fetchMessages = async () => {
    if (currentUserId && contact._id && !isChatBot) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/getMessages?senderId=${currentUserId}&receiverId=${contact._id}`);
        const sortedMessages = response.data.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sortedMessages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!isChatBot) {
      try {
        const response = await axios.post('/api/getMessages', {
          senderId: contact._id,
          receiverId: currentUserId,
          currentUserId: currentUserId
        });
        console.log('Messages marked as read:', response.data);
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.sender === contact._id ? {...msg, read: true} : msg
          )
        );
        // Update unreadCount if needed
        if (typeof onSelectContact === 'function') {
          onSelectContact(contact);
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  useEffect(() => {
    if (currentUserId && contact._id) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [currentUserId, contact._id]);

  useEffect(() => {
    if (!currentUserId || !contact._id || isChatBot) return;

    const connectWebSocket = () => {
      ws.current = new WebSocket(`ws://localhost:8080?userId=${currentUserId}`);

      ws.current.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.sender === contact._id || message.receiver === contact._id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from WebSocket server. Trying to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [currentUserId, contact._id, isChatBot]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateContacts = async () => {
    if (!isChatBot) {
      try {
        const response = await axios.post('/api/updateContacts', {
          senderId: currentUserId,
          receiverId: contact._id
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error updating contacts:", error);
      }
    }
  };

  const sendMessage = async (text = input, sender = currentUserId) => {
    if ((ws.current || isChatBot) && text.trim() && currentUserId && contact._id) {
      const message = {
        text: text.trim(),
        sender: sender,
        receiver: contact._id,
        timestamp: new Date().toISOString(),
      };
      
      try {
        if (!isChatBot) {
          ws.current.send(JSON.stringify(message));
        }
        setMessages((prevMessages) => [...prevMessages, message]);
        setInput('');

        if (isFirstMessage && !isChatBot) {
          await updateContacts();
          setIsFirstMessage(false);
        }

        if (!isChatBot) {
          await axios.post('/api/saveMessage', message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="fixed bottom-4 max-[460px]:bottom-0 right-4 max-[460px]:right-0 max-w-md w-[400px] h-[70%] max-[460px]:h-[100%] max-[460px]:w-[100%] bg-white shadow-lg rounded-lg  max-[460px]:rounded-none overflow-hidden z-[200] flex flex-col">
      <div className="flex items-center justify-between p-4 bg-blue-500">
        <div className="flex space-x-5 items-center">
          <button onClick={onBack} className="text-white">
            <Image
              src="/assets/img_main/arrowback.png"
              alt="Back"
              width={24}
              height={24}
              className="w-4 h-4"
            />
          </button>
          <div className="flex space-x-2 items-center">
            <Image
              src={contact.profilePicture || "/assets/img_main/usericon.png"}
              alt={`Contact ${contact.username}`}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <h2 className="text-white text-lg">{contact.firstname}</h2>
          </div>
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

      <div className="flex-1 overflow-y-auto p-4">
  {isChatBot ? (
    
    <Chatbot onSendMessage={sendMessage} />
  ) : (
    
    isLoading ? (
      <div className="text-center">Loading messages...</div>
    ) : (
      messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 ${
            message.sender === currentUserId ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-2 rounded-lg ${
              message.sender === currentUserId
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            <p>{message.text}</p>
            <span className="text-xs opacity-50">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      ))
    )
  )}
  <div ref={messagesEndRef} />
</div>

{/* แสดง input การพิมพ์หรือปิดการใช้งานเมื่อเป็นแชทบอท */}
{!isChatBot && (
  <div className="p-4 border-t">
    <div className="flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
        className="flex-1 border rounded-full py-2 px-4 mr-2"
      />
      <button
        onClick={() => sendMessage()}
        className="bg-blue-500 text-white rounded-full p-2"
      >
        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="m21.42 5.67-3.28 13.12a3.53 3.53 0 0 1-3.47 2.7h-.02a3.52 3.52 0 0 1-3.46-2.75l-.86-3.65 5.38-5.38a1 1 0 1 0-1.42-1.42l-5.38 5.38-3.65-.86a3.58 3.58 0 0 1-.05-6.95l13.12-3.28a2.55 2.55 0 0 1 3.1 3.09Z" />
        </svg>
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Chat;