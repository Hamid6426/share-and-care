"use client";

import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full"
      />
      <button
        onClick={handleSearch}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;