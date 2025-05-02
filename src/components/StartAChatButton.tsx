"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance"; 

interface StartChatButtonProps {
  userId: string; // receiverId
}

export default function StartChatButton({ userId }: StartChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { currentUser, isUserLoading } = useAuth();

  const handleStartChat = async () => {
    const senderId = currentUser?._id;

    if (!senderId) {
      toast.error("User not authenticated.");
      return;
    }

    if (isUserLoading) {
      toast.error("User data is still loading. Try again in a moment.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/api/chats", {
        senderId,
        receiverId: userId,
      });

      if (!data.chatId) throw new Error("Chat ID not found in response");

      router.push(`/chats/${data.chatId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="cursor-pointer px-4 py-2 bg-primary text-white rounded hover:bg-accent disabled:opacity-50"
    >
      {loading ? "Starting..." : "Start Chat"}
    </button>
  );
}
