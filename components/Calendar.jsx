'use client'

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { th } from 'date-fns/locale';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 w-[350px] max-lg:w-[100%] max-sm:w-full">
      <Calendar
        onChange={setDate}
        value={date}
        className="border-none mx-auto"
        locale={th} // กำหนด locale เป็นภาษาไทย
      />
      <p className="text-center text-gray-500">Selected date: {date.toDateString()}</p>
    </div>
  );
};

export default CalendarComponent;