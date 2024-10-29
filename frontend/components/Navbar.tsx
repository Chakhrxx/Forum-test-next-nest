"use client";
import { useState } from "react";
import RightSidebar from "./RightSidebar";

interface NavbarProps {
  rightSidebarIndex: string;
}

export default function Navbar({ rightSidebarIndex }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  // Toggle the sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Navbar container */}
      <nav className="h-[60px] w-full flex bg-green-500 items-center justify-between px-6 fixed top-0 left-0 z-10 ">
        <h1 className="font-castoro italic font-normal text-white text-[20px]">
          a Board {/* Title of the application */}
        </h1>
        {/* Sign in button for larger screens */}
        <a href="/sign-in" className="">
          <button className="hidden lg:flex bg-success font-ibm-plex text-white text-[14px] font-semibold rounded-lg items-center px-8 py-2 shadow-sm">
            Sign in
          </button>
        </a>

        {/* Hamburger menu button for mobile screens */}
        <button className="flex lg:hidden items-center" onClick={toggleSidebar}>
          <img
            src="/images/hamburger.png"
            alt="hamburger"
            className="w-[20px] h-[20px]"
          />
        </button>
      </nav>

      {/* RightSidebar component with controlled visibility */}
      <RightSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        index={rightSidebarIndex}
      />
    </>
  );
}
