import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Bot, Loader2 } from 'lucide-react'
import config from '../../../config'

const API_BASE = config.API_URL;

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! 🌱 I'm CropCare AI Assistant. How can I help you with your plants today?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const userMessage = inputValue.trim();
    const newMessages = [...messages, { text: userMessage, sender: "user" }];
    setMessages(newMessages);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: "bot" }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.", 
        sender: "bot" 
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-end sm:justify-end sm:p-6 bg-black/50 sm:bg-transparent">
      <div className="bg-white w-full h-full sm:w-[380px] sm:h-[600px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
               <Bot size={24} />
            </div>
            <div>
              <h3 className="font-bold font-raleway tracking-wide">CropCare Bot</h3>
              <p className="text-xs text-green-100 font-medium">Online</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? 'bg-green-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-400 p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-sm">Typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your crops..."
            disabled={isSending}
            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-gray-700 placeholder-gray-400 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-md transition-all flex items-center justify-center shrink-0 hover:scale-105 active:scale-95"
          >
            <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
          </button>
        </div>

      </div>
    </div>
  );
};

const ChatbotComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className='flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity transform transition-transform hover:scale-105'
      >
          <div className='w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-4 text-xl sm:text-2xl font-bold text-green-500 shadow-lg'>
              <props.icon className='w-5 h-5 sm:w-8 sm:h-8' />
          </div>
          <h3 className='font-semibold text-sm sm:text-base md:text-lg text-white drop-shadow-md'>{props.title}</h3>
          <p className='text-gray-200 tracking-wide text-xs sm:text-sm drop-shadow-sm'>{props.desc}</p>
      </div>

      {isOpen && <ChatModal onClose={() => setIsOpen(false)} />}
    </>
  )
}

export default ChatbotComponent;