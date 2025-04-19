
// Define types for better type safety
export type DateInput = Date | string | number;
export type DateFormatType = 'relative' | string;
export type DateUnit = 'day' | 'month' | 'year' | 'hour' | 'minute' | 'second' | 'week' | 'quarter';
export type SortOrder = 'asc' | 'desc';

export interface DateSortable {
  [key: string]: DateInput;
}

/**
 * Custom hook for date utilities
 * @returns Object with date utility functions
 */
export const useDateFunctions = () => {
  /**
   * Formats a date according to the specified format
   * @param date The date to format
   * @param format The format string
   * @returns Formatted date string
   */
  const formatDateString = (date: Date, format: string = 'DD MMMM YYYY'): string => {
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Pad with leading zeros
    const pad = (num: number): string => num.toString().padStart(2, '0');
    
    // Month names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Short month names
    const monthNamesShort = monthNames.map(m => m.substring(0, 3));
    
    // Day names
    const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ];
    
    // Short day names
    const dayNamesShort = dayNames.map(d => d.substring(0, 3));
    
    // Replace format tokens
    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MMMM/g, monthNames[month - 1])
      .replace(/MMM/g, monthNamesShort[month - 1])
      .replace(/MM/g, pad(month))
      .replace(/M/g, month.toString())
      .replace(/DD/g, pad(day))
      .replace(/D/g, day.toString())
      .replace(/HH/g, pad(hours))
      .replace(/H/g, hours.toString())
      .replace(/hh/g, pad(hours % 12 || 12))
      .replace(/h/g, (hours % 12 || 12).toString())
      .replace(/mm/g, pad(minutes))
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, pad(seconds))
      .replace(/s/g, seconds.toString())
      .replace(/A/g, hours >= 12 ? 'PM' : 'AM')
      .replace(/a/g, hours >= 12 ? 'pm' : 'am')
      .replace(/dddd/g, dayNames[date.getDay()])
      .replace(/ddd/g, dayNamesShort[date.getDay()]);
  };

  /**
   * Formats a relative time string (e.g., "2 days ago")
   * @param date The date to format
   * @returns Formatted relative time string
   */
  const getRelativeTimeString = (date: DateInput): string => {
    const now = new Date();
    const inputDate = new Date(date);
    
    // Check if date is valid
    if (isNaN(inputDate.getTime())) {
      return 'Invalid date';
    }
    
    const diffMs = now.getTime() - inputDate.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    const diffMonth = Math.round(diffDay / 30);
    const diffYear = Math.round(diffDay / 365);
    
    if (diffSec < 5) {
      return 'just now';
    } else if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return diffMin === 1 ? 'a minute ago' : `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return diffHour === 1 ? 'an hour ago' : `${diffHour} hours ago`;
    } else if (diffDay < 30) {
      return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
    } else if (diffMonth < 12) {
      return diffMonth === 1 ? 'a month ago' : `${diffMonth} months ago`;
    } else {
      return diffYear === 1 ? 'a year ago' : `${diffYear} years ago`;
    }
  };

  /**
   * Sorts an array of objects by a date field in specified order
   * @param data Array of objects with a date field
   * @param dateField The field name containing the date
   * @param order Sort order ('asc' for ascending, 'desc' for descending)
   * @returns Sorted array
   */
  const sortByDate = <T extends DateSortable>(
    data: T[],
    dateField: keyof T,
    order: SortOrder = 'desc'
  ): T[] => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a[dateField]).getTime();
      const dateB = new Date(b[dateField]).getTime();
      
      return order === 'desc' 
        ? dateB - dateA
        : dateA - dateB;
    });
  };

  /**
   * Formats a date based on the specified type
   * @param date Date to format
   * @param formatType Format type ('relative' for relative time, or any format string)
   * @param defaultFormat Default format to use if formatType is not provided
   * @returns Formatted date string
   */
  const formatDate = (
    date: DateInput,
    formatType: DateFormatType = 'DD MMMM YYYY',
    defaultFormat: string = 'DD MMMM YYYY'
  ): string => {
    const inputDate = new Date(date);
    
    // Return invalid date message if date is invalid
    if (isNaN(inputDate.getTime())) {
      return 'Invalid date';
    }

    // For relative time
    if (formatType === 'relative') {
      return getRelativeTimeString(date);
    }
    
    // If it's today, show relative time
    const now = new Date();
    if (
      inputDate.getDate() === now.getDate() &&
      inputDate.getMonth() === now.getMonth() &&
      inputDate.getFullYear() === now.getFullYear()
    ) {
      return getRelativeTimeString(date);
    }
    
    // Use custom formatter
    return formatDateString(inputDate, formatType || defaultFormat);
  };

  /**
   * Gets a date that is a specified number of units ago in ISO format
   * @param amount Number of units to go back
   * @param unit Time unit (day, month, year, etc.)
   * @param format Output format (default: 'YYYY-MM-DD')
   * @returns Formatted date string
   */
  const getDateAgo = (
    amount: number = 7,
    unit: DateUnit = 'day',
    format: string = 'YYYY-MM-DD'
  ): string => {
    const now = new Date();
    const result = new Date(now);
    
    switch (unit) {
      case 'second':
        result.setSeconds(now.getSeconds() - amount);
        break;
      case 'minute':
        result.setMinutes(now.getMinutes() - amount);
        break;
      case 'hour':
        result.setHours(now.getHours() - amount);
        break;
      case 'day':
        result.setDate(now.getDate() - amount);
        break;
      case 'week':
        result.setDate(now.getDate() - (amount * 7));
        break;
      case 'month':
        result.setMonth(now.getMonth() - amount);
        break;
      case 'quarter':
        result.setMonth(now.getMonth() - (amount * 3));
        break;
      case 'year':
        result.setFullYear(now.getFullYear() - amount);
        break;
    }
    
    return formatDateString(result, format);
  };

  /**
   * Checks if a date is within a specified time range from now
   * @param date Date to check
   * @param amount Number of units to check against
   * @param unit Time unit (day, month, year, etc.)
   * @returns Boolean indicating if the date is within the range
   */
  const isDateWithinRange = (
    date: DateInput,
    amount: number = 7,
    unit: DateUnit = 'day'
  ): boolean => {
    const inputDate = new Date(date);
    
    // Return false if date is invalid
    if (isNaN(inputDate.getTime())) {
      return false;
    }
    
    const rangeDate = new Date();
    
    switch (unit) {
      case 'second':
        rangeDate.setSeconds(rangeDate.getSeconds() - amount);
        break;
      case 'minute':
        rangeDate.setMinutes(rangeDate.getMinutes() - amount);
        break;
      case 'hour':
        rangeDate.setHours(rangeDate.getHours() - amount);
        break;
      case 'day':
        rangeDate.setDate(rangeDate.getDate() - amount);
        break;
      case 'week':
        rangeDate.setDate(rangeDate.getDate() - (amount * 7));
        break;
      case 'month':
        rangeDate.setMonth(rangeDate.getMonth() - amount);
        break;
      case 'quarter':
        rangeDate.setMonth(rangeDate.getMonth() - (amount * 3));
        break;
      case 'year':
        rangeDate.setFullYear(rangeDate.getFullYear() - amount);
        break;
    }
    
    return inputDate >= rangeDate;
  };

  /**
   * Calculates the estimated reading time for content
   * @param content Text content to calculate reading time for
   * @param wordsPerMinute Average reading speed in words per minute
   * @returns Reading time in minutes
   */
  const getReadTime = (content: string | null | undefined, wordsPerMinute: number = 265): number => {
    if (!content) {
      return 0;
    }
    
    // Count words by splitting on whitespace
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  /**
   * Gets the current date in the specified format
   * @param format Date format string
   * @returns Formatted current date
   */
  const getCurrentDate = (format: string = 'YYYY-MM-DD'): string => {
    return formatDateString(new Date(), format);
  };

  /**
   * Calculates the difference between two dates in the specified unit
   * @param date1 First date
   * @param date2 Second date (defaults to current date)
   * @param unit Unit for difference calculation
   * @returns Difference as a number (positive if date1 is after date2)
   */
  const getDateDifference = (
    date1: DateInput,
    date2: DateInput = new Date(),
    unit: DateUnit = 'day'
  ): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Return 0 if either date is invalid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }
    
    const diffMs = d1.getTime() - d2.getTime();
    
    switch (unit) {
      case 'second':
        return Math.floor(diffMs / 1000);
      case 'minute':
        return Math.floor(diffMs / (1000 * 60));
      case 'hour':
        return Math.floor(diffMs / (1000 * 60 * 60));
      case 'day':
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      case 'week':
        return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
      case 'month':
        // Approximate months
        return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.4375));
      case 'quarter':
        // Approximate quarters
        return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 91.3125));
      case 'year':
        // Approximate years
        return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365.25));
      default:
        return diffMs;
    }
  };

  /**
   * Checks if a date is before another date
   * @param date1 Date to check
   * @param date2 Date to compare against (defaults to current date)
   * @param unit Precision unit for comparison
   * @returns Boolean indicating if date1 is before date2
   */
  const isDateBefore = (
    date1: DateInput,
    date2: DateInput = new Date(),
    unit: DateUnit = 'day'
  ): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Return false if either date is invalid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    if (unit === 'day') {
      return (
        d1.getFullYear() < d2.getFullYear() ||
        (d1.getFullYear() === d2.getFullYear() && d1.getMonth() < d2.getMonth()) ||
        (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() < d2.getDate())
      );
    }
    
    return getDateDifference(d1, d2, unit) < 0;
  };

  /**
   * Checks if a date is after another date
   * @param date1 Date to check
   * @param date2 Date to compare against (defaults to current date)
   * @param unit Precision unit for comparison
   * @returns Boolean indicating if date1 is after date2
   */
  const isDateAfter = (
    date1: DateInput,
    date2: DateInput = new Date(),
    unit: DateUnit = 'day'
  ): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Return false if either date is invalid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    if (unit === 'day') {
      return (
        d1.getFullYear() > d2.getFullYear() ||
        (d1.getFullYear() === d2.getFullYear() && d1.getMonth() > d2.getMonth()) ||
        (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() > d2.getDate())
      );
    }
    
    return getDateDifference(d1, d2, unit) > 0;
  };

  /**
   * Formats a date range between two dates
   * @param startDate Start date
   * @param endDate End date
   * @param format Format for individual dates
   * @param separator Separator between dates
   * @returns Formatted date range string
   */
  const formatDateRange = (
    startDate: DateInput,
    endDate: DateInput,
    format: string = 'DD MMM YYYY',
    separator: string = ' - '
  ): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid date range';
    }
    
    return `${formatDateString(start, format)}${separator}${formatDateString(end, format)}`;
  };

  /**
 * Calculate date range based on timeRange
 * @param timeRange - Time range to calculate date from
 * @returns ISO date string for the calculated date
 */
 const calculateDateRange = (timeRange: 'day' | 'week' | 'month' = 'week'): string => {
  const currentDate = new Date();
  let pastDate: Date;

  switch (timeRange) {
    case 'day':
      pastDate = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      pastDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'week':
    default:
      pastDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
  }

  return pastDate.toISOString().split('T')[0];
}

  return {
    sortByDate,
    formatDate,
    getDateAgo,
    isDateWithinRange,
    getReadTime,
    getCurrentDate,
    getDateDifference,
    isDateBefore,
    isDateAfter,
    formatDateRange,
    calculateDateRange
  };
};

export default useDateFunctions;
