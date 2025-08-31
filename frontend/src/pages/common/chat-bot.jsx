import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Utility function for class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Gemini API Service
class GeminiApiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';
  }

  async generateResponse(messages) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured in environment variables');
    }

    const systemPrompt = {
      role: 'user',
      parts: [{
        text: `You are "Mangrove Mind", an educational assistant specializing in mangrove forests. Your expertise covers:

🌱 CORE TOPICS:
- Mangrove ecosystem importance and functions
- Biodiversity and species (plants, animals, marine life)
- Climate change mitigation and carbon storage
- Coastal protection and storm buffers  
- Threats: deforestation, pollution, development
- Conservation efforts and restoration projects
- Mangrove adaptations to saltwater environments
- Economic importance to local communities

🎯 YOUR ROLE:
- Provide accurate, educational information about mangroves
- Use engaging, accessible language suitable for all ages
- Include relevant emojis (🌱🦀🐠🌊) to make responses friendly
- Connect topics to broader environmental concepts when relevant
- Encourage curiosity and further learning
- If asked about non-mangrove topics, gently redirect to mangrove-related aspects

📚 RESPONSE STYLE:
- Start with enthusiasm about the mangrove topic
- Provide 2-3 key facts or insights
- Use specific examples when possible
- End with a follow-up question to encourage continued learning
- Keep responses informative but conversational (150-300 words)

Remember: You're passionate about mangrove conservation and education!`
      }]
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [systemPrompt, ...messages],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to communicate with Gemini API');
    }
  }
}

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default" }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  return { toast, toasts };
};

// Animated Toast Component
const Toast = ({ toast, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: -50, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.95 }}
    className={cn(
      "p-4 rounded-xl shadow-xl backdrop-blur-sm max-w-sm border",
      toast.variant === "destructive" 
        ? "bg-red-500/90 text-white border-red-400" 
        : "bg-white/90 border-emerald-200 text-gray-900"
    )}
  >
    <div className="flex justify-between items-start">
      <div>
        {toast.title && <div className="font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm mt-1 opacity-90">{toast.description}</div>}
      </div>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center"
      >
        ×
      </motion.button>
    </div>
  </motion.div>
);

// Animated Chat Message Component
const ChatMessage = ({ message, isUser, timestamp }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className={cn(
          "max-w-[80%] px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border",
          isUser 
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto rounded-br-md border-blue-400" 
            : "bg-white/80 text-gray-900 mr-auto rounded-bl-md border-gray-200"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-70 mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-current rounded-full"></span>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

// Enhanced Typing Indicator Component
const TypingIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex justify-start mb-6"
    >
      <div className="bg-white/80 backdrop-blur-sm text-gray-900 px-6 py-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-lg"
          >
            🌱
          </motion.div>
          <span className="text-sm font-medium">Mangrove Mind is thinking</span>
          <div className="flex space-x-1 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.div 
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-emerald-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Input Box Component
const InputBox = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-t border-gray-200/50 bg-gray-50/50 p-4"
    >
      <div className="flex gap-3">
        <motion.div 
          className="flex-1 relative"
          animate={{ 
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask about mangrove forests, biodiversity, climate change..."
            disabled={disabled}
            className={cn(
              "w-full min-h-[48px] max-h-24 resize-none bg-white border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-300 text-sm",
              isFocused 
                ? "border-emerald-400 shadow-md shadow-emerald-500/10" 
                : "border-gray-200 hover:border-gray-300"
            )}
            rows={1}
          />
          {message.trim() && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"
            >
              {message.length}
            </motion.div>
          )}
        </motion.div>
        
        <motion.button 
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "h-[48px] w-[48px] shrink-0 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300",
            message.trim() && !disabled
              ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          <motion.span
            animate={{ rotate: message.trim() ? 0 : -45 }}
            transition={{ duration: 0.3 }}
          >
            ➤
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Enhanced Message List Component
const MessageList = ({ messages, isTyping }) => {
  return (
    <div className="px-6">
      <div className="py-4">
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center py-8"
            >
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3"
              >
                Welcome to Mangrove Mind
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 max-w-md mx-auto text-base leading-relaxed mb-6"
              >
                Your educational assistant for learning about mangrove forests, their biodiversity, 
                and role in our ecosystem. Ask me anything! 🌊
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 max-w-sm mx-auto"
              >
                {[
                  { emoji: "🦀", text: "Marine Life" },
                  { emoji: "🌊", text: "Coastal Protection" },
                  { emoji: "🌍", text: "Climate Impact" },
                  { emoji: "🔬", text: "Research & Science" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-white/80 transition-all duration-300"
                  >
                    <div className="text-xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{item.text}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
            </AnimatePresence>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Error Boundary Component
const ErrorMessage = ({ error, onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-xl"
  >
    <div className="text-center">
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="font-semibold text-red-800 mb-2">Connection Error</h3>
      <p className="text-red-600 text-sm mb-4">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
      >
        Try Again
      </motion.button>
    </div>
  </motion.div>
);

// Main Chat Component
const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [geminiService] = useState(new GeminiApiService());
  const [error, setError] = useState(null);
  const { toast, toasts } = useToast();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendToGemini = async (userMessage, conversationHistory) => {
    try {
      // Convert conversation history to Gemini format
      const geminiMessages = conversationHistory
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));

      // Add current user message
      geminiMessages.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      return await geminiService.generateResponse(geminiMessages);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSendMessage = async (content) => {
    const userMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await sendToGemini(content, messages);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      toast({
        title: "Connection Error",
        description: "Failed to get response. Please check your connection!",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Optionally retry the last message
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.isUser);
      if (lastUserMessage) {
        handleSendMessage(lastUserMessage.content);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Animated Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast 
              key={toast.id} 
              toast={toast} 
              onClose={() => {
                // Remove toast logic
              }} 
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Chat Container */}
      <motion.div 
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Header with Gradient */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="relative z-10 px-6 py-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl"
              >
                🌱
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="font-bold text-2xl text-white mb-1"
                >
                  Mangrove Mind
                </motion.h1>
                <motion.p 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-emerald-100 text-sm"
                >
                  Educational Assistant for Mangrove Forests & Marine Ecosystems
                </motion.p>
              </div>
              
              {/* Status Indicator */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-emerald-300 rounded-full"
                />
                <span className="text-white text-xs font-medium">Online</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Messages Container with fixed height */}
        <div className="h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto" ref={scrollAreaRef}>
            <MessageList messages={messages} isTyping={isTyping} />
          </div>
          
          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <div className="px-6 pb-4">
                <ErrorMessage error={error} onRetry={handleRetry} />
              </div>
            )}
          </AnimatePresence>
          
          {/* Input */}
          <InputBox onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;