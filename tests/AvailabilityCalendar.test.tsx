import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AvailabilityCalendar from '@/components/public/AvailabilityCalendar';
import type { AvailabilityData } from '@/components/public/AvailabilityCalendar';

describe('AvailabilityCalendar', () => {
  const mockAvailabilityData: AvailabilityData[] = [
    { date: '2024-01-15', status: 'BOOKED' },
    { date: '2024-01-16', status: 'BOOKED' },
    { date: '2024-01-20', status: 'AVAILABLE' },
    { date: '2024-01-21', status: 'AVAILABLE' },
    { date: '2024-02-10', status: 'BOOKED' },
    { date: '2024-02-15', status: 'AVAILABLE' },
  ];

  const propertyId = 'test-property-1';

  beforeEach(() => {
    // Mock current date to ensure consistent tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Rendering', () => {
    it('should render the calendar with current month and year', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('should render all weekday headers', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      weekdays.forEach((day) => {
        expect(screen.getByText(day)).toBeInTheDocument();
      });
    });

    it('should render the legend with status indicators', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      expect(screen.getByText('Available')).toBeInTheDocument();
      expect(screen.getByText('Booked')).toBeInTheDocument();
      expect(screen.getByText('Past')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      expect(screen.getByLabelText('Previous month')).toBeInTheDocument();
      expect(screen.getByLabelText('Next month')).toBeInTheDocument();
    });
  });

  describe('Month Navigation', () => {
    it('should navigate to next month when next button is clicked', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);

      expect(screen.getByText('February 2024')).toBeInTheDocument();
    });

    it('should navigate to previous month when previous button is clicked', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);

      const prevButton = screen.getByLabelText('Previous month');
      fireEvent.click(prevButton);

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('should navigate across year boundaries', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      
      // Click next 12 times to go to next year
      for (let i = 0; i < 12; i++) {
        fireEvent.click(nextButton);
      }

      expect(screen.getByText('January 2025')).toBeInTheDocument();
    });

    it('should update calendar within 500ms when navigating', () => {
      const { rerender } = render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const startTime = performance.now();
      const nextButton = screen.getByLabelText('Next month');
      fireEvent.click(nextButton);
      
      rerender(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500);
      expect(screen.getByText('February 2024')).toBeInTheDocument();
    });
  });

  describe('Date Status Display', () => {
    it('should display booked dates with appropriate styling', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const bookedDate = screen.getByLabelText('2024-01-15 - booked');
      expect(bookedDate).toHaveClass('bg-red-100');
      expect(bookedDate).toHaveClass('line-through');
      expect(bookedDate).toBeDisabled();
    });

    it('should display available dates with appropriate styling', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const availableDate = screen.getByLabelText('2024-01-20 - available');
      expect(availableDate).toHaveClass('bg-green-50');
      expect(availableDate).not.toBeDisabled();
    });

    it('should display past dates as disabled', () => {
      // Set current date to later in the month
      jest.setSystemTime(new Date('2024-01-25'));

      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const pastDate = screen.getByLabelText('2024-01-15 - past');
      expect(pastDate).toHaveClass('bg-gray-100');
      expect(pastDate).toBeDisabled();
    });

    it('should handle dates not in availability data as available', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      // Date 25 is not in mock data, should default to available
      const undefinedDate = screen.getByLabelText('2024-01-25 - available');
      expect(undefinedDate).toHaveClass('bg-green-50');
    });
  });

  describe('Date Range Selection', () => {
    it('should select start date when clicking an available date', () => {
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const availableDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(availableDate);

      expect(screen.getByText(/Selected dates:/)).toBeInTheDocument();
      expect(screen.getByText(/2024-01-20/)).toBeInTheDocument();
      expect(onDateRangeSelect).toHaveBeenCalledWith(
        expect.any(Date),
        null
      );
    });

    it('should select end date when clicking second available date', () => {
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const startDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(startDate);

      const endDate = screen.getByLabelText('2024-01-21 - available');
      fireEvent.click(endDate);

      expect(screen.getByText(/2024-01-20 to 2024-01-21/)).toBeInTheDocument();
      expect(onDateRangeSelect).toHaveBeenCalledTimes(2);
    });

    it('should swap dates if end date is before start date', () => {
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const laterDate = screen.getByLabelText('2024-01-21 - available');
      fireEvent.click(laterDate);

      const earlierDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(earlierDate);

      expect(screen.getByText(/2024-01-20 to 2024-01-21/)).toBeInTheDocument();
    });

    it('should highlight selected dates', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const startDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(startDate);

      expect(startDate).toHaveClass('bg-green-600');
    });

    it('should highlight date range between start and end', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={[
            { date: '2024-01-20', status: 'AVAILABLE' },
            { date: '2024-01-21', status: 'AVAILABLE' },
            { date: '2024-01-22', status: 'AVAILABLE' },
            { date: '2024-01-23', status: 'AVAILABLE' },
          ]}
        />
      );

      const startDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(startDate);

      const endDate = screen.getByLabelText('2024-01-23 - available');
      fireEvent.click(endDate);

      const middleDate = screen.getByLabelText('2024-01-21 - available');
      expect(middleDate).toHaveClass('bg-green-200');
    });

    it('should reset selection when clicking third date', () => {
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const firstDate = screen.getByLabelText('2024-01-20 - available');
      fireEvent.click(firstDate);

      const secondDate = screen.getByLabelText('2024-01-21 - available');
      fireEvent.click(secondDate);

      const thirdDate = screen.getByLabelText('2024-01-25 - available');
      fireEvent.click(thirdDate);

      // Should start new selection
      expect(screen.getByText(/2024-01-25/)).toBeInTheDocument();
      expect(screen.queryByText(/to/)).not.toBeInTheDocument();
    });

    it('should not allow selecting booked dates', () => {
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const bookedDate = screen.getByLabelText('2024-01-15 - booked');
      fireEvent.click(bookedDate);

      expect(onDateRangeSelect).not.toHaveBeenCalled();
      expect(screen.queryByText(/Selected dates:/)).not.toBeInTheDocument();
    });

    it('should not allow selecting past dates', () => {
      jest.setSystemTime(new Date('2024-01-25'));
      const onDateRangeSelect = jest.fn();
      
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          onDateRangeSelect={onDateRangeSelect}
        />
      );

      const pastDate = screen.getByLabelText('2024-01-15 - past');
      fireEvent.click(pastDate);

      expect(onDateRangeSelect).not.toHaveBeenCalled();
    });
  });

  describe('Touch Target Accessibility', () => {
    it('should have minimum 44px touch targets for navigation buttons', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const nextButton = screen.getByLabelText('Next month');
      const prevButton = screen.getByLabelText('Previous month');

      expect(nextButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
      expect(prevButton).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });

    it('should have minimum 44px touch targets for date cells', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const availableDate = screen.getByLabelText('2024-01-20 - available');
      expect(availableDate).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });
  });

  describe('Responsive Design', () => {
    it('should render with responsive container classes', () => {
      const { container } = render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const calendarContainer = container.querySelector('.max-w-4xl');
      expect(calendarContainer).toBeInTheDocument();
    });

    it('should have overflow handling for mobile', () => {
      const { container } = render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
        />
      );

      const tableContainer = container.querySelector('.overflow-x-auto');
      expect(tableContainer).toBeInTheDocument();
    });
  });

  describe('12 Months Display Support', () => {
    it('should be able to navigate through 12 months of data', () => {
      const extendedAvailabilityData: AvailabilityData[] = [];
      
      // Generate 12 months of data
      for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 28; day++) {
          const date = new Date(2024, month, day);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          extendedAvailabilityData.push({
            date: dateStr,
            status: day % 3 === 0 ? 'BOOKED' : 'AVAILABLE',
          });
        }
      }

      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={extendedAvailabilityData}
        />
      );

      const nextButton = screen.getByLabelText('Next month');

      // Navigate through all 12 months
      const months = [
        'January 2024', 'February 2024', 'March 2024', 'April 2024',
        'May 2024', 'June 2024', 'July 2024', 'August 2024',
        'September 2024', 'October 2024', 'November 2024', 'December 2024'
      ];

      months.forEach((month, index) => {
        expect(screen.getByText(month)).toBeInTheDocument();
        if (index < months.length - 1) {
          fireEvent.click(nextButton);
        }
      });
    });
  });

  describe('Editable Prop', () => {
    it('should accept editable prop without errors', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          editable={true}
        />
      );

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });

    it('should work with editable set to false', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={mockAvailabilityData}
          editable={false}
        />
      );

      expect(screen.getByText('January 2024')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should render calendar with no availability data', () => {
      render(
        <AvailabilityCalendar
          propertyId={propertyId}
          availabilityData={[]}
        />
      );

      expect(screen.getByText('January 2024')).toBeInTheDocument();
      // All future dates should be available by default
      const availableDates = screen.getAllByLabelText(/available/);
      expect(availableDates.length).toBeGreaterThan(0);
    });
  });
});
