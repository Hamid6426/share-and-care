"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns"; // Add date-fns for better date formatting

interface Chat {
  _id: string;
  senderId: {
    _id: string;
    name: string;
  };
  receiverId: {
    _id: string;
    name: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
  chatId: string; // Add chatId to the Chat interface
}

interface ChatProps {
  userId: string; // from session
  receiverId: string; // from route param
}

const ChatPage = ({ userId, receiverId }: ChatProps) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate chatId based on the first message's timestamp if no messages exist
  const getChatId = () => {
    if (messages.length > 0) {
      return messages[0].chatId; // Use existing chatId from the first message
    }
    // Generate new chatId with timestamp for the first chat
    return `chat-${Date.now()}`;
  };

  const chatId = getChatId();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChatId) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/chats/${currentChatId}`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [currentChatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Determine if this is the first message
      const isFirstMessage = messages.length === 0 && !currentChatId;
      const chatIdToSend = isFirstMessage ? `chat-${Date.now()}` : currentChatId;

      const res = await fetch(`/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userId,
          receiverId,
          message: newMessage,
          chatId: chatIdToSend,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newChatData: Chat = await res.json();

      // If this was the first message, set the chatId
      if (isFirstMessage) {
        setCurrentChatId(newChatData.chatId);
      }

      setMessages((prev) => [...prev, newChatData]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <span className="loading">Loading messages...</span>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg._id} className={`mb-4 ${msg.senderId._id === userId ? "ml-auto text-right" : "mr-auto"}`}>
                <div className={`inline-block p-3 rounded-lg ${msg.senderId._id === userId ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                  <p className="text-sm">{msg.message}</p>
                  <span className="text-xs mt-1 block opacity-75">{format(new Date(msg.createdAt), "HH:mm")}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-green-500"
            maxLength={500}
          />
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors" disabled={!newMessage.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPage;
