"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

interface Item {
  _id: string;
  title: string;
  description: string;
  quantity: number;
  images: string[];
  status: "inactive" | "available" | "requested" | "claimed" | "picked" | "donated";
  isRequested: boolean;
  donor: { _id: string; name: string; email: string };
  receiver: { _id: string; name: string; email: string } | null;
}

interface ItemsContextType {
  items: Item[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = async (page: number) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/items", {
        params: { page, limit: 12 },
      });
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  return (
    <ItemsContext.Provider value={{ items, isLoading, currentPage, totalPages, setCurrentPage }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = (): ItemsContextType => {
  const context = useContext(ItemsContext);
  if (!context) throw new Error("useItems must be used within an ItemsProvider");
  return context;
};
