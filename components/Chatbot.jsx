// components/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = ({ onSendMessage }) => {
  const [questions, setQuestions] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/chatBot');
      const activeQuestions = Object.entries(response.data.data).reduce((acc, [category, categoryQuestions]) => {
        const activeCategoryQuestions = categoryQuestions.filter(q => q.isActive === true);
        if (activeCategoryQuestions.length > 0) {
          acc[category] = activeCategoryQuestions;
        }
        return acc;
      }, {});
      setQuestions(activeQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleQuestionClick = async (questionId) => {
    try {
      const response = await axios.post('/api/chatBot', { action: "search", questionId });
      if (response.data.success) {
        setSelectedQuestion(response.data.question);
        addMessage(response.data.question, 'user');
        setTimeout(() => {
          addMessage(response.data.answer, 'bot');
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
      addMessage("Sorry, I couldn't fetch the answer. Please try again.", 'bot');
    }
  };

  const addMessage = (content, sender) => {
    setChatMessages(prevMessages => [...prevMessages, { content, sender }]);
  };

  return (
    <div className=" flex flex-col h-[100%]">
      <div className=" overflow-y-auto p-4  ">
        {chatMessages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        <h3 className="text-lg font-semibold mb-4 text-orange-500 pt-4 max-sm:text-base">เลือกคำถามที่ต้องการถามได้เลยครับ</h3>
      {Object.entries(questions).map(([category, categoryQuestions]) => (
            <div key={category} className="mb-4 ">
              <h4 className="font-medium mb-2 text-sm text-orange-400 text-center">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {categoryQuestions.map((q) => (
                  <button 
                    key={q.id} 
                    onClick={() => handleQuestionClick(q.id)} 
                    className="bg-gray-100 text-gray-800 text-sm py-1 px-3 rounded-full hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          ))}
      </div>
        </div>
      
  );
};

export default Chatbot;