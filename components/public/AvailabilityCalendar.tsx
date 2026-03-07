'use client';

import React, { useState, useMemo } from 'react';

export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED';

export interface AvailabilityData {
  date: string; // ISO date string (YYYY-MM-DD)
  status: AvailabilityStatus;
}

export interface AvailabilityCalendarProps {
  propertyId: string;
  availabilityData: AvailabilityData[];
  editable?: boolean;
  onDateRangeSelect?: (startDate: Date, endDate: Date | null) => void;
}

interface CalendarDate {
  date: Date;
  status: 'available' | 'booked' | 'past' | 'empty';
  isSelected: boolean;
  isInRange: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  propertyId,
  availabilityData,
  editable = false,
  onDateRangeSelect,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  // Create a map for quick availability lookup
  const availabilityMap = useMemo(() => {
    const map = new Map<string, AvailabilityStatus>();
    availabilityData.forEach(({ date, status }) => {
      map.set(date, status);
    });
    return map;
  }, [availabilityData]);

  // Get the status for a specific date
  const getDateStatus = (date: Date): 'available' | 'booked' | 'past' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'past';
    }

    const dateStr = formatDateToISO(date);
    const status = availabilityMap.get(dateStr);
    
    return status === 'BOOKED' ? 'booked' : 'available';
  };

  // Format date to ISO string (YYYY-MM-DD)
  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is in the selected range
  const isDateInRange = (date: Date): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Generate calendar dates for the current month
  const generateCalendarDates = (): CalendarDate[][] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const weeks: CalendarDate[][] = [];
    let currentWeek: CalendarDate[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        status: 'empty',
        isSelected: false,
        isInRange: false,
      });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getDateStatus(date);
      const isSelected = Boolean(
        (selectedStartDate && formatDateToISO(date) === formatDateToISO(selectedStartDate)) ||
        (selectedEndDate && formatDateToISO(date) === formatDateToISO(selectedEndDate))
      );
      const isInRange = isDateInRange(date);
      
      currentWeek.push({
        date,
        status,
        isSelected,
        isInRange,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add empty cells for remaining days in the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: new Date(0),
          status: 'empty',
          isSelected: false,
          isInRange: false,
        });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  // Handle date click
  const handleDateClick = (date: Date, status: 'available' | 'booked' | 'past' | 'empty') => {
    if (status === 'empty' || status === 'past') return;
    
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      if (onDateRangeSelect) {
        onDateRangeSelect(date, null);
      }
    } else {
      // Complete the range
      if (date < selectedStartDate) {
        // If clicked date is before start, swap them
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
        if (onDateRangeSelect) {
          onDateRangeSelect(date, selectedStartDate);
        }
      } else {
        setSelectedEndDate(date);
        if (onDateRangeSelect) {
          onDateRangeSelect(selectedStartDate, date);
        }
      }
    }
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get month and year display
  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarWeeks = generateCalendarDates();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get CSS classes for date cell
  const getDateCellClasses = (calendarDate: CalendarDate): string => {
    const baseClasses = 'min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-sm font-medium transition-colors';
    
    if (calendarDate.status === 'empty') {
      return `${baseClasses} invisible`;
    }
    
    if (calendarDate.status === 'past') {
      return `${baseClasses} text-gray-400 bg-gray-100 cursor-not-allowed`;
    }
    
    if (calendarDate.status === 'booked') {
      return `${baseClasses} text-gray-500 bg-red-100 line-through cursor-not-allowed`;
    }
    
    // Available dates
    let classes = `${baseClasses} cursor-pointer hover:bg-green-100`;
    
    if (calendarDate.isSelected) {
      classes += ' bg-green-600 text-white hover:bg-green-700';
    } else if (calendarDate.isInRange) {
      classes += ' bg-green-200 text-green-900';
    } else {
      classes += ' bg-green-50 text-green-900';
    }
    
    return classes;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Previous month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {monthYearDisplay}
        </h2>
        
        <button
          onClick={goToNextMonth}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Next month"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-700">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-gray-700">Past</span>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="p-2 text-center text-sm font-semibold text-gray-700"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarWeeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((calendarDate, dayIndex) => (
                  <td key={dayIndex} className="p-1">
                    <button
                      onClick={() => handleDateClick(calendarDate.date, calendarDate.status)}
                      className={getDateCellClasses(calendarDate)}
                      disabled={calendarDate.status === 'empty' || calendarDate.status === 'past' || calendarDate.status === 'booked'}
                      aria-label={
                        calendarDate.status !== 'empty'
                          ? `${formatDateToISO(calendarDate.date)} - ${calendarDate.status}`
                          : undefined
                      }
                    >
                      {calendarDate.status !== 'empty' && calendarDate.date.getDate()}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected date range display */}
      {selectedStartDate && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Selected dates:
          </p>
          <p className="text-base text-gray-900">
            {formatDateToISO(selectedStartDate)}
            {selectedEndDate && ` to ${formatDateToISO(selectedEndDate)}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
