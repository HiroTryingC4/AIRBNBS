'use client';

import React, { useState, useEffect } from 'react';

interface AvailabilityData {
  id: string;
  date: string;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
}

interface CalendarDate {
  date: Date;
  status: 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'PAST' | 'EMPTY';
  availabilityId?: string;
  isSelected: boolean;
}

interface CalendarManagerProps {
  propertyId: string;
  propertyName: string;
}

export default function CalendarManager({ propertyId, propertyName }: CalendarManagerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [propertyId, currentMonth]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      const response = await fetch(
        `/api/properties/${propertyId}/availability?year=${year}&month=${month}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateToISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateStatus = (date: Date): 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'PAST' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'PAST';
    }

    const dateStr = formatDateToISO(date);
    const avail = availability.find(a => a.date.startsWith(dateStr));
    
    return avail?.status || 'AVAILABLE';
  };

  const generateCalendarDates = (): CalendarDate[][] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const weeks: CalendarDate[][] = [];
    let currentWeek: CalendarDate[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push({
        date: new Date(0),
        status: 'EMPTY',
        isSelected: false,
      });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getDateStatus(date);
      const dateStr = formatDateToISO(date);
      const avail = availability.find(a => a.date.startsWith(dateStr));
      const isSelected = selectedDates.some(d => formatDateToISO(d) === dateStr);
      
      currentWeek.push({
        date,
        status,
        availabilityId: avail?.id,
        isSelected,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: new Date(0),
          status: 'EMPTY',
          isSelected: false,
        });
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const handleDateClick = (calendarDate: CalendarDate) => {
    if (calendarDate.status === 'EMPTY' || calendarDate.status === 'PAST') return;
    
    const dateStr = formatDateToISO(calendarDate.date);
    const isAlreadySelected = selectedDates.some(d => formatDateToISO(d) === dateStr);
    
    if (isAlreadySelected) {
      setSelectedDates(selectedDates.filter(d => formatDateToISO(d) !== dateStr));
    } else {
      setSelectedDates([...selectedDates, calendarDate.date]);
    }
  };

  const updateDatesStatus = async (newStatus: 'AVAILABLE' | 'BOOKED' | 'BLOCKED') => {
    if (selectedDates.length === 0) {
      alert('Please select at least one date');
      return;
    }

    setSaving(true);
    try {
      const dates = selectedDates.map(date => formatDateToISO(date));

      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates, status: newStatus }),
      });

      if (response.ok) {
        await loadAvailability();
        setSelectedDates([]);
        alert(`Successfully updated ${selectedDates.length} date(s) to ${newStatus}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDates([]);
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDates([]);
  };

  const monthYearDisplay = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const calendarWeeks = generateCalendarDates();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateCellClasses = (calendarDate: CalendarDate): string => {
    const baseClasses = 'min-w-[50px] min-h-[50px] flex items-center justify-center rounded-lg text-sm font-medium transition-all';
    
    if (calendarDate.status === 'EMPTY') {
      return `${baseClasses} invisible`;
    }
    
    if (calendarDate.status === 'PAST') {
      return `${baseClasses} text-gray-400 bg-gray-100 cursor-not-allowed`;
    }
    
    let classes = `${baseClasses} cursor-pointer border-2`;
    
    if (calendarDate.isSelected) {
      classes += ' border-[#E6D3B3] bg-[#E6D3B3] text-gray-900 scale-95';
    } else {
      classes += ' border-transparent hover:border-gray-300';
      
      if (calendarDate.status === 'AVAILABLE') {
        classes += ' bg-green-100 text-green-900 hover:bg-green-200';
      } else if (calendarDate.status === 'BOOKED') {
        classes += ' bg-red-100 text-red-900 hover:bg-red-200';
      } else if (calendarDate.status === 'BLOCKED') {
        classes += ' bg-gray-200 text-gray-700 hover:bg-gray-300';
      }
    }
    
    return classes;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E6D3B3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Calendar for {propertyName}
        </h2>
        <div className="text-sm text-gray-600">
          {selectedDates.length} date(s) selected
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900">{monthYearDisplay}</h3>
        
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border border-green-200 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 border border-red-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded"></div>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#E6D3B3] border-2 border-[#E6D3B3] rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekDays.map((day) => (
                <th key={day} className="p-2 text-center text-sm font-semibold text-gray-700">
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
                      onClick={() => handleDateClick(calendarDate)}
                      className={getDateCellClasses(calendarDate)}
                      disabled={calendarDate.status === 'EMPTY' || calendarDate.status === 'PAST'}
                    >
                      {calendarDate.status !== 'EMPTY' && calendarDate.date.getDate()}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Update Selected Dates</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => updateDatesStatus('AVAILABLE')}
            disabled={selectedDates.length === 0 || saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Available
          </button>
          <button
            onClick={() => updateDatesStatus('BOOKED')}
            disabled={selectedDates.length === 0 || saving}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Booked
          </button>
          <button
            onClick={() => updateDatesStatus('BLOCKED')}
            disabled={selectedDates.length === 0 || saving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark as Blocked
          </button>
          <button
            onClick={() => setSelectedDates([])}
            disabled={selectedDates.length === 0 || saving}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear Selection
          </button>
        </div>
        {saving && (
          <p className="mt-3 text-sm text-gray-600">Saving changes...</p>
        )}
      </div>
    </div>
  );
}
