import { useState, useEffect, useRef } from 'react';
import { detectCrisisWords } from '../utils/crisisDetection';
import { CrisisAlert } from './CrisisAlert';
import { CountdownTimer } from './CountdownTimer';
import { PaymentButton } from './PaymentButton';
import { ReferralForm } from './ReferralForm';
import { Send, User, Bot } from 'lucide-react';
import { useGeminiApi } from '../hooks/useGeminiApi';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

interface ChatProps {
  userName: string;
  phq9Score: number;
}

export function Chat({ userName, phq9Score }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useGeminiApi();
  
  // Initialize chat with a welcome message
  useEffect(() => {
    const initialMessage = {
      id: 'welcome',
      text: `Hi ${userName}! I'm here to chat with you about how you're feeling today. How can I help?`,
      sender: 'ai' as const,
      timestamp: Date.now()
    };
    
    // Load conversation history from localStorage if available
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([initialMessage]);
    }
  }, [userName]);
  
  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Check for crisis words
    if (detectCrisisWords(newMessage)) {
      setShowCrisisAlert(true);
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    try {
      // Create a context for the AI based on PHQ-9 score
      let context = "";
      if (phq9Score <= 4) {
        context = "The user has minimal depression symptoms.";
      } else if (phq9Score <= 9) {
        context = "The user has mild depression symptoms.";
      } else if (phq9Score <= 14) {
        context = "The user has moderate depression symptoms.";
      } else if (phq9Score <= 19) {
        context = "The user has moderately severe depression symptoms.";
      } else {
        context = "The user has severe depression symptoms.";
      }
      
      const aiResponse = await sendMessage(`${context} User says: ${newMessage}`);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I'm sorry, I'm having trouble connecting. Please try again in a moment.",
        sender: 'ai',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {showCrisisAlert && <CrisisAlert onClose={() => setShowCrisisAlert(false)} />}
      
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">Chat with AI Assistant</h1>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.sender === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-gray-700" />
                )}
                <span className="text-xs opacity-75">{formatTime(message.timestamp)}</span>
              </div>
              <p className="whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <ReferralForm />
        
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
            disabled={isLoading || showPaymentModal}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-150 disabled:bg-blue-400"
            disabled={isLoading || !newMessage.trim() || showPaymentModal}
          >
            <Send size={20} />
          </button>
        </form>
        
        <div className="mt-4 flex justify-between items-center">
          <CountdownTimer duration={300} onFinish={() => setShowPaymentModal(true)} />
          <PaymentButton />
        </div>
      </div>
      
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Continue Your Conversation</h2>
            <p className="mb-4">Your free session has ended. Subscribe to continue chatting with our AI assistant.</p>
            <div className="space-y-3">
              <button 
                onClick={() => alert("Connecting to payment API...")}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-150"
              >
                Subscribe Now - $9.99/month
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 px-4 border border-gray-300 hover:bg-gray-100 font-medium rounded-xl transition-all duration-150"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}