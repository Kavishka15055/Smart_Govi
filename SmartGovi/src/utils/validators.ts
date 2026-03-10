export class Validators {
  // Validate email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Validate password (min 6 characters)
  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
  
  // Validate phone number (Sri Lankan format)
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(?:\+94|0)?[1-9]\d{8}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }
  
  // Validate amount (positive number)
  static isValidAmount(amount: number): boolean {
    return !isNaN(amount) && amount > 0;
  }
  
  // Validate quantity (positive number)
  static isValidQuantity(quantity: number): boolean {
    return !isNaN(quantity) && quantity > 0;
  }
  
  // Validate required field
  static isRequired(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }
  
  // Validate date
  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
  
  // Validate future date (optional - can't be in future)
  static isNotFutureDate(date: Date): boolean {
    return date <= new Date();
  }
  
  // Validate number range
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }
  
  // Validate category selection
  static isValidCategory(category: string, categories: string[]): boolean {
    return categories.includes(category);
  }
  
  // Validate farm types (at least one selected)
  static hasFarmTypes(types: any[]): boolean {
    return types.length > 0;
  }
  
  // Get validation error message
  static getErrorMessage(field: string, error: string): string {
    const messages: Record<string, Record<string, string>> = {
      email: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
      },
      password: {
        required: 'Password is required',
        minLength: 'Password must be at least 6 characters',
      },
      name: {
        required: 'Full name is required',
      },
      phone: {
        required: 'Phone number is required',
        invalid: 'Please enter a valid Sri Lankan phone number',
      },
      amount: {
        required: 'Amount is required',
        invalid: 'Amount must be greater than 0',
      },
      category: {
        required: 'Please select a category',
      },
      quantity: {
        required: 'Quantity is required',
        invalid: 'Quantity must be greater than 0',
      },
    };
    
    return messages[field]?.[error] || 'Invalid input';
  }
}