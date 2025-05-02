"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";
import { MdArrowBack } from "react-icons/md";
import Link from "next/link";

interface IChat {
  _id: string;
  chatId: string;
  participants: string[];
  updatedAt: string;
}

interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  text: string;
  timestamp: string;
}

export default function ChatDashboard() {
  const { currentUser, isUserLoading } = useAuth();
  const [chats, setChats] = useState<IChat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Fetch all chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser?._id) return;

      try {
        const { data } = await axiosInstance.get("/api/chats");
        setChats(data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || err.message || "Failed to fetch chats");
      } finally {
        setLoadingChats(false);
      }
    };

    if (!isUserLoading && currentUser) {
      fetchChats();
    }
  }, [isUserLoading, currentUser]);

  // Fetch messages for selected chat
  const fetchMessages = useCallback(async () => {
    if (!selectedChatId) return;
    try {
      const { data } = await axiosInstance.get("/api/messages", {
        params: { chatId: selectedChatId },
      });
      setMessages(data);
      setHasScrolled(false); // Reset scroll flag on new chat
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Could not load chat");
    } finally {
      setLoadingMessages(false);
    }
  }, [selectedChatId]);

  // Auto-fetch messages every 10s
  useEffect(() => {
    if (!isUserLoading && currentUser && selectedChatId) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 10000);
      return () => clearInterval(intervalId);
    }
  }, [selectedChatId, isUserLoading, currentUser, fetchMessages]);

  // Scroll to last message once after messages load
  useEffect(() => {
    if (!hasScrolled && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      setHasScrolled(true);
    }
  }, [messages, hasScrolled]);

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedChatId) return;
    try {
      const { data } = await axiosInstance.post("/api/messages", {
        chatId: selectedChatId,
        text: messageText,
      });
      setMessages((prev) => [...prev, data]);
      setMessageText("");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Message failed");
    }
  }

  if (isUserLoading || loadingChats) return <p>Loading...</p>;

  return (
    <div className="w-full p-[1rem]">
      <main className="h-[calc(100vh_-_2.1rem)] border border-primary w-full flex rounded-lg pr-[1rem]">
        {/* Chats List */}
        <section className="border-r border-primary  px-[1rem] py-2 w-full max-w-80">
          <div className="w-full flex items-center gap-4 text-xl font-bold text-primary mb-4">
            <Link href="/">
              <MdArrowBack />
            </Link>
            <h2 className="">My Chats</h2>
          </div>
          {chats.length === 0 ? (
            <p>No chats yet.</p>
          ) : (
            <ul className="space-y-4">
              {chats.map((chat) => {
                const otherUserId = chat.participants.find((id) => id !== currentUser?._id);
                return (
                  <li key={chat._id} className="border  cursor-pointer border-primary rounded p-4 bg-card shadow-soft transition">
                    <button
                      onClick={() => {
                        setSelectedChatId(chat.chatId);
                        setLoadingMessages(true);
                        setMessages([]);
                      }}
                      className="w-full cursor-pointer text-left"
                    >
                      <div className="font-medium text-primary">
                        userId:{" "}
                        <span className="font-bold text-sm">
                          <Link href={`/${otherUserId}`} className="hover:underline underline-offset-2 text-xs">{otherUserId}</Link>
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">Last updated: {new Date(chat.updatedAt).toLocaleString()}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Chat Window */}
        <section className="px-4 py-4 w-full">
          {selectedChatId ? (
            <div className="w-full">
              <h2 className="text-xl font-bold text-white p-3 bg-primary w-full">Chat</h2>
              {loadingMessages ? (
                <p>Loading chat...</p>
              ) : (
                <>
                  <div className="w-full h-[60vh] overflow-y-auto bg-card rounded p-4 space-y-3">
                    {messages.map((msg) => {
                      const isMe = msg.sender === currentUser?._id;
                      return (
                        <div key={msg._id} className={`p-2 rounded max-w-[60%] ${isMe ? "bg-primary text-white ml-auto" : "shadow-soft text-text-primary"}`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className="text-xs text-right mt-1">
                            {isMe ? "You" : "Other"} • {new Date(msg.timestamp).toLocaleTimeString()}
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
                    <button onClick={handleSendMessage} className="bg-accent hover:bg-secondary text-white px-4 py-2 rounded-md transition">
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Select a chat to start messaging.</p>
          )}
        </section>
      </main>
    </div>
  );
}
