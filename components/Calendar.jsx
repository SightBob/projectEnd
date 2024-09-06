'use client'

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { th } from 'date-fns/locale';

const CalendarComponent = ({ onDateChange, selectedDate }) => {
  const handleDateChange = (date) => {
    console.log('Date selected in calendar:', date);
    onDateChange(date);
  }
 
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl space-y-4 w-[350px] max-lg:w-[100%] max-sm:w-full">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        className="border-none mx-auto"
        locale={th}
      />
      <p className="text-center text-gray-500">Selected date: {selectedDate ? selectedDate.toDateString() : "0/0/0000"}</p>
    </div>
  );
};

export default CalendarComponent;

