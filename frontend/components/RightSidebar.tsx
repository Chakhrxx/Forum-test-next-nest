"use client";
import React, { useEffect, useRef, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  index: string;
}

const RightSidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  index,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<string>(index);

  const handleClick = (item: string) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-end z-10 lg:hidden">
        <div
          ref={sidebarRef}
          className="bg-green-500 w-[70%]  h-full p-8 drop-shadow-xl "
        >
          <button
            onClick={toggleSidebar}
            className="mb-12 text-white lg:hidden"
          >
            <img
              src="/images/arrow.svg"
              alt="Close"
              className="w-[24px] h-[24px]"
            />
          </button>
          <ul className="space-y-6 text-white lg:text-black">
            <li
              className={`flex items-center space-x-1 ${
                selectedItem === "home" ? "font-[800]" : "font-[500]"
              } text-[16px] text-white`}
              onClick={() => handleClick("home")}
            >
              <img
                src="/images/edit.svg"
                alt="Home"
                className="w-[24px] h-[24px] fill-black"
              />
              <a href="/">Home</a>
            </li>

            <li
              className={`flex items-center space-x-1 ${
                selectedItem === "blogs" ? "font-[800]" : "font-[500]"
              } text-[16px] text-white`}
              onClick={() => handleClick("blogs")}
            >
              <img
                src="/images/edit.svg"
                alt="Our Blog"
                className="w-[24px] h-[24px] fill-black"
              />
              <a href="/blogs">Our Blog</a>
            </li>
          </ul>
        </div>
      </div>
    )
  );
};

export default RightSidebar;
