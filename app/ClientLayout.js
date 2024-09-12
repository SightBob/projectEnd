"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatContainer from "@/components/ChatContainer";

export default function ClientLayout({ children }) {
  const [isChatVisible, setIsChatVisible] = useState(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const closeChat = () => {
    setIsChatVisible(false);
  };

  return (
    <>
      <Navbar toggleChat={toggleChat} />
      {children}
      {isChatVisible && <ChatContainer onClose={closeChat} />}
    </>
  );
}