import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/datepicker.css';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => (
  <div className="mt-4 bg-gray-900 p-4 rounded-lg">
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate || undefined}
      endDate={endDate || undefined}
      selectsRange
      inline
      className="dark-theme-calendar"
    />
  </div>
);

export default DateRangePicker;