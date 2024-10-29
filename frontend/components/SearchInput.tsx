// SearchInput.tsx
"use client";
import { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  onSearch: (value: string) => void; // Callback function to handle search input
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState(""); // State to manage the input value
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Reference for the timeout

  // Handle input change events
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value; // Get the current input value
    setInputValue(value); // Update the input value state

    // Clear the previous timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to trigger the search after 1 second of inactivity
    timeoutRef.current = setTimeout(() => {
      if (value.trim() !== "") {
        onSearch(value); // Trigger the search with the trimmed input value
      }
    }, 500); // 500ms delay
  };

  // Cleanup the timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear the timeout if the component is unmounted
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      className="w-full font-ibm-plex rounded-lg p-2 placeholder:text-secondary placeholder:text-[16px] placeholder:font-ibm-plex outline-success" // Input styling
      placeholder="Search"
    />
  );
};

export default SearchInput;
