export class Formatters {
  // Format currency (Rs 45,000)
  static formatCurrency(amount: number): string {
    return `Rs ${amount.toLocaleString('en-LK')}`;
  }
  
  // Format compact currency for small spaces
  static formatCompactCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `Rs ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `Rs ${(amount / 1000).toFixed(1)}K`;
    }
    return `Rs ${amount}`;
  }
  
  // Format number with commas
  static formatNumber(num: number): string {
    return num.toLocaleString('en-LK');
  }
  
  // Format quantity with unit (10 kg)
  static formatQuantity(quantity: number, unit: string): string {
    return `${quantity} ${unit}`;
  }
  
  // Format percentage
  static formatPercentage(value: number, total: number): string {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(0)}%`;
  }
  
  // Format phone number
  static formatPhoneNumber(phone: string): string {
    // Simple formatting for Sri Lankan numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  }
  
  // Truncate text
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  // Get initials from name
  static getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  // Format file size
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Capitalize first letter
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  // Format category name for display
  static formatCategoryName(category: string): string {
    return category
      .split('_')
      .map(word => this.capitalize(word))
      .join(' ');
  }
}