import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";

interface DropdownProps {
  onSelect: (option: string) => void;
  selected: string;
  className?: string;
}

const community = [
  "History",
  "Food",
  "Pets",
  "Health",
  "Fashion",
  "Exercise",
  "Others",
];

const Dropdown: React.FC<DropdownProps> = ({
  onSelect,
  selected,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null); // Track hovered option
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    setHoveredOption(null); // Reset hovered option on selection
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className={classNames(
            "inline-flex justify-between w-32 px-2 py-2 bg-gray-100 text-sm font-medium text-gray-700 outline-none",
            className
          )}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {selected}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-70 flex z-10" />
          <div
            className="absolute z-20 mt-1 w-32 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            ref={dropdownRef}
          >
            <div className="py-1 overflow-y-scroll" role="none">
              {community.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(item)}
                  onMouseEnter={() => setHoveredOption(item)} // Set hovered option on mouse enter
                  onMouseLeave={() => setHoveredOption(null)} // Reset on mouse leave
                  className="flex px-4 py-2 text-sm hover:bg-green-100 w-full text-left font-medium justify-between"
                >
                  <span>{item}</span>
                  {hoveredOption === item && ( // Show image if hovered
                    <img
                      src="/images/selected.svg"
                      alt="selected Icon"
                      className="w-[16px] h-[16px] cursor-pointer"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
