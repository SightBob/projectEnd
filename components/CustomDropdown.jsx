'use client'

import React, { useState, useRef, useEffect } from 'react';

const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="mt-2 px-2 border rounded-md max-w-[300px] py-1 w-full cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || placeholder}
      </div>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 border rounded-md mt-1 max-h-60 overflow-y-auto bg-white">
          {options.map((option) => (
            <div
              key={option}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;