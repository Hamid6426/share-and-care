"use client";

import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaTshirt,
  FaCouch,
  FaLaptop,
  FaUtensils,
  FaPenFancy,
  FaPuzzlePiece,
  FaBoxes,
  FaHandHoldingHeart,
  FaCheckCircle,
} from "react-icons/fa";
import {
  MdMoneyOff,
  MdAttachMoney,
  MdCategory,
  MdInfoOutline,
} from "react-icons/md";

type StatusInfo = Record<
  string,
  { name: string; color: string; message: string }
>;

type Props = {
  categoryOptions: string[];
  statusInfo: StatusInfo;
  initialFilters?: {
    searchTerm: string;
    selectedStatuses: Set<string>;
    selectedPriceFilters: Set<string>;
    selectedCategories: Set<string>;
  };
  onFiltersChange: (filters: {
    searchTerm: string;
    selectedStatuses: Set<string>;
    selectedPriceFilters: Set<string>;
    selectedCategories: Set<string>;
  }) => void;
};

const priceKeys = ["free", "not-free"];

const ItemFilters: React.FC<Props> = ({
  categoryOptions,
  statusInfo,
  initialFilters,
  onFiltersChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(
    initialFilters?.searchTerm ?? ""
  );
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
    () => initialFilters?.selectedStatuses ?? new Set(Object.keys(statusInfo))
  );
  const [selectedPriceFilters, setSelectedPriceFilters] = useState<Set<string>>(
    () => initialFilters?.selectedPriceFilters ?? new Set(priceKeys)
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => initialFilters?.selectedCategories ?? new Set(categoryOptions)
  );

  const allCategoriesSelected =
    selectedCategories.size === categoryOptions.length;
  const allStatusesSelected =
    selectedStatuses.size === Object.keys(statusInfo).length;
  const allPricesSelected = selectedPriceFilters.size === priceKeys.length;

  useEffect(() => {
    onFiltersChange({
      searchTerm,
      selectedStatuses,
      selectedPriceFilters,
      selectedCategories,
    });
  }, [
    searchTerm,
    selectedStatuses,
    selectedPriceFilters,
    selectedCategories,
    onFiltersChange,
  ]);

  const toggleAllCategories = () => {
    setSelectedCategories(
      allCategoriesSelected ? new Set() : new Set(categoryOptions)
    );
  };
  const toggleAllStatuses = () => {
    setSelectedStatuses(
      allStatusesSelected ? new Set() : new Set(Object.keys(statusInfo))
    );
  };
  const toggleAllPrices = () => {
    setSelectedPriceFilters(allPricesSelected ? new Set() : new Set(priceKeys));
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };
  const togglePriceFilter = (filter: string) => {
    setSelectedPriceFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  };
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const categoryIcons: Record<string, React.JSX.Element> = {
    Clothes: <FaTshirt size={20} />,
    Books: <FaBook size={20} />,
    Food: <FaUtensils size={20} />,
    Electronics: <FaLaptop size={20} />,
    Furniture: <FaCouch size={20} />,
    Stationary: <FaPenFancy size={20} />,
    Toys: <FaPuzzlePiece size={20} />,
    Other: <FaBoxes size={20} />,
  };

  const statusIcons: Record<string, React.JSX.Element> = {
    available: <MdInfoOutline size={20} />,
    claimed: <FaHandHoldingHeart size={20} />,
    picked: <FaCheckCircle size={20} />,
  };

  const priceIcons: Record<string, React.JSX.Element> = {
    free: <MdMoneyOff size={20} />,
    "not-free": <MdAttachMoney size={20} />,
  };

  const getAllButtonClass = (isSelected: boolean) => `
    group flex items-center gap-2 pl-3 pr-8 py-2 rounded-full text-sm font-semibold transition-all duration-200
    ${
      isSelected
        ? "text-primary border-primary/50 hover:bg-gray-50 border-4"
        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-100 hover:shadow-md border-4"
    }
  `;

  const getOtherButtonClass = (isSelected: boolean) => `
    group flex items-center gap-2 pl-3 pr-8 py-2 rounded-full text-sm font-semibold transition-all duration-200
    ${
      isSelected
        ? "text-primary border-primary/50 hover:bg-gray-50 border-4"
        : "bg-white text-gray-500 border-gray-100 hover:bg-gray-100 hover:shadow-md border-4"
    }
  `;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleAllCategories}
          className={getAllButtonClass(allCategoriesSelected)}
        >
          <MdCategory size={20} />
          All
        </button>

        {categoryOptions.map((cat) => {
          const isSelected = selectedCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={getOtherButtonClass(isSelected)}
            >
              {categoryIcons[cat]}
              {cat}
            </button>
          );
        })}
      </div>

      {/* Statuses */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleAllStatuses}
          className={getAllButtonClass(allStatusesSelected)}
        >
          <MdCategory size={20} />
          All
        </button>

        {Object.entries(statusInfo).map(([key, { name }]) => {
          const isSelected = selectedStatuses.has(key);
          return (
            <button
              key={key}
              onClick={() => toggleStatus(key)}
              className={getOtherButtonClass(isSelected)}
            >
              {statusIcons[key]}
              {name}
            </button>
          );
        })}
      </div>

      {/* Price */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleAllPrices}
          className={getAllButtonClass(allPricesSelected)}
        >
          <MdCategory size={20} />
          All
        </button>

        {[
          { key: "free", label: "Free" },
          { key: "not-free", label: "Not Free" },
        ].map(({ key, label }) => {
          const isSelected = selectedPriceFilters.has(key);
          return (
            <button
              key={key}
              onClick={() => togglePriceFilter(key)}
              className={getOtherButtonClass(isSelected)}
            >
              {priceIcons[key]}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ItemFilters;
