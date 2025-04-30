"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function ChatRoom() {
  const { chatId } = useParams() as { chatId: string };
  const { currentUser, isUserLoading } = useAuth();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/api/messages", {
        params: { chatId },
      });
      setMessages(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Could not load chat");
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (!isUserLoading && currentUser) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 10000);
      return () => clearInterval(intervalId);
    }
  }, [chatId, isUserLoading, currentUser, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading || isUserLoading) return <p>Loading chat...</p>;
  if (!currentUser) return <p>User not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold text-primary mb-4">Chat</h1>

      <div className="h-[60vh] overflow-y-auto bg-card rounded p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser._id;
          return (
            <div
              key={msg._id}
              className={`p-2 rounded max-w-[75%] ${
                isMe
                  ? "bg-primary text-white ml-auto"
                  : "bg-card text-text-primary"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-right mt-1">
                {isMe ? "You" : "Other"} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border border-secondary rounded px-4 py-2"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-accent hover:bg-secondary text-white px-4 py-2 rounded-md transition"
        >
          Send
        </button>
      </div>
    </div>
  );

  async function handleSendMessage() {
    if (!messageText.trim()) return;
    try {
      const { data } = await axiosInstance.post("/api/messages", {
        chatId,
        text: messageText,
      });
      setMessages((prev) => [...prev, data]);
      setMessageText("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Message failed");
    }
  }
}
