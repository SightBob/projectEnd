'use client'

import React, { useState, useRef, useEffect } from 'react';

const ProfileDropdown = ({ options, value, onChange, placeholder, disabled }) => {
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

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`mt-2 px-2 border rounded-md max-w-[325px] py-2  w-full cursor-pointer ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}`}
        onClick={toggleDropdown}
      >
        {value || placeholder}
      </div>
      {isOpen && !disabled && (
        <div className="absolute bottom-full left-0 right-0 border rounded-md mt-1 max-h-60 overflow-y-auto max-w-[325px] bg-white z-10">
          {options.map((option) => (
            <div
              key={option}
              className="px-2 py-1 cursor-pointer  hover:bg-gray-200"
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

export default ProfileDropdown;