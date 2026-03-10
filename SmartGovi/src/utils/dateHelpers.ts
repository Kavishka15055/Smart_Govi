import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth,
  subMonths,
  format,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { DateRange, FilterPeriod } from '../types';

export class DateHelpers {
  // Get date range based on filter period
  static getDateRange(period: FilterPeriod, customStart?: Date, customEnd?: Date): DateRange {
    const now = new Date();
    
    switch (period) {
      case 'Today':
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now)
        };
        
      case 'This Week':
        return {
          startDate: startOfWeek(now, { weekStartsOn: 1 }), // Monday
          endDate: endOfWeek(now, { weekStartsOn: 1 }) // Sunday
        };
        
      case 'This Month':
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now)
        };
        
      case 'Last 3 Months':
        return {
          startDate: startOfDay(subMonths(now, 3)),
          endDate: endOfDay(now)
        };
        
      case 'Custom':
        if (customStart && customEnd) {
          return {
            startDate: startOfDay(customStart),
            endDate: endOfDay(customEnd)
          };
        }
        // Fallback to last 3 months
        return {
          startDate: startOfDay(subMonths(now, 3)),
          endDate: endOfDay(now)
        };
        
      default:
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now)
        };
    }
  }
  
  // Format date for display
  static formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
    if (typeof date === 'string') {
      return format(parseISO(date), formatStr);
    }
    return format(date, formatStr);
  }
  
  // Format date for input
  static formatDateForInput(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
  
  // Get relative day name (Today, Yesterday, or date)
  static getRelativeDayName(date: Date): string {
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subMonths(new Date(), 0));
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = startOfDay(date);
    
    if (inputDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (inputDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return this.formatDate(date, 'MMM dd, yyyy');
    }
  }
  
  // Check if date is in range
  static isDateInRange(date: Date, range: DateRange): boolean {
    return isWithinInterval(date, {
      start: range.startDate,
      end: range.endDate
    });
  }
  
  // Get month name
  static getMonthName(date: Date): string {
    return format(date, 'MMMM');
  }
  
  // Get year
  static getYear(date: Date): number {
    return date.getFullYear();
  }
  
  // Get last 3 months range (Jan 1 - Mar 31 style)
  static getLast3MonthsRange(): DateRange {
    const now = new Date();
    const start = subMonths(now, 3);
    
    return {
      startDate: startOfDay(start),
      endDate: endOfDay(now)
    };
  }
  
  // Format range for display (e.g., "January 1 - March 31, 2026")
  static formatDateRange(range: DateRange): string {
    const start = this.formatDate(range.startDate, 'MMMM d');
    const end = this.formatDate(range.endDate, 'MMMM d, yyyy');
    return `${start} - ${end}`;
  }
}