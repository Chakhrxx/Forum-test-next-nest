"use client";
import React, { useState } from "react";
interface LeftSidebarProps {
  index: string; // Define the prop type for index
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ index }) => {
  const [selectedItem, setSelectedItem] = useState<string>(index);

  const handleClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className="hidden lg:flex fixed left-0 top-0 w-[280px] h-full p-8 bg-gray-100 overflow-y-auto z-5 pt-[80px]">
      <ul className="space-y-6 text-green-500">
        <li
          className={`flex items-center space-x-1 ${
            selectedItem === "home" ? "font-[800]" : "font-[500]"
          } text-[16px] text-green-500`}
          onClick={() => handleClick("home")}
        >
          <img
            src="/images/home-line-green.svg"
            alt="Home"
            className="w-[24px] h-[24px] "
          />
          <a href="/">Home</a>
        </li>
        <li
          className={`flex items-center space-x-1 ${
            selectedItem === "blogs" ? "font-[800]" : "font-[500]"
          } text-[16px] text-green-500`}
          onClick={() => handleClick("blogs")}
        >
          <img
            src="/images/edit-line-green.svg"
            alt="Our Blog"
            className="w-[24px] h-[24px]"
          />

          <a href="/blogs">Our Blog</a>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
