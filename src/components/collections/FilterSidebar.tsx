"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filterOptions: {
    size: string[];
    color: string[];
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filterOptions, onFilterChange, onClose }) => {
  const [openSections, setOpenSections] = useState<{ size: boolean; color: boolean }>({
    size: true,
    color: true,
  });

  const toggleSection = (section: "size" | "color") => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterClick = (filterType: string, value: string) => {
    onFilterChange(filterType, value);
    onClose(); // One-Tap Filter: close the sidebar on any filter interaction
  };

  return (
    <div className="overflow-y-auto">
      <h3 className="text-lg font-bold font-heading text-foreground mb-6">Filters</h3>
      
      {/* Size Filter Section */}
      <div className="mb-6 border-b border-border pb-4">
        <button
          onClick={() => toggleSection("size")}
          className="flex w-full items-center justify-between text-left mb-3"
        >
          <h4 className="font-semibold font-sans text-foreground">Size</h4>
          {openSections.size ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
        </button>
        {openSections.size && (
          <div className="space-y-2">
            {filterOptions.size.map((size) => (
              <label
                key={size}
                className="flex items-center gap-3 cursor-pointer group"
                htmlFor={`size-${size}`}
              >
                <input
                  type="checkbox"
                  id={`size-${size}`}
                  onChange={() => handleFilterClick("size", size)}
                  className={cn(
                    "h-4 w-4 rounded border-border text-primary",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "cursor-pointer"
                  )}
                />
                <span className="text-sm font-sans text-foreground group-hover:text-primary transition-colors">
                  {size}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("color")}
          className="flex w-full items-center justify-between text-left mb-3"
        >
          <h4 className="font-semibold font-sans text-foreground">Color</h4>
          {openSections.color ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
        </button>
        {openSections.color && (
          <div className="space-y-2">
            {filterOptions.color.map((color) => (
              <label
                key={color}
                className="flex items-center gap-3 cursor-pointer group"
                htmlFor={`color-${color}`}
              >
                <input
                  type="checkbox"
                  id={`color-${color}`}
                  onChange={() => handleFilterClick("color", color)}
                  className={cn(
                    "h-4 w-4 rounded border-border text-primary",
                    "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "cursor-pointer"
                  )}
                />
                <span className="text-sm font-sans text-foreground group-hover:text-primary transition-colors">
                  {color}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;