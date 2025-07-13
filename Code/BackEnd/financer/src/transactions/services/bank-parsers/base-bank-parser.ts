import { ParsedTransaction } from '../csv-parser.service';

export enum BankType {
  TBC = 'TBC',
  BOG = 'BOG',
}

export abstract class BaseBankParser {
  abstract readonly bankType: BankType;
  abstract readonly categoryMappings: Map<string, string>;
  abstract canParse(csvContent: string): boolean;
  abstract parseTransactions(csvContent: string): Promise<ParsedTransaction[]>;

  protected parseDate(dateString: string): Date | null {
    if (!dateString || dateString.trim() === '') {
      return null;
    }

    try {
      // Handle DD/MM/YYYY format
      const trimmedDate = dateString.trim();
      const parts = trimmedDate.split('/');

      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);

        return new Date(year, month, day);
      }

      return null;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }

  protected parseAmount(amountString: string): number {
    if (!amountString || amountString.trim() === '') {
      return 0;
    }

    try {
      // Remove currency symbols and non-numeric characters except dots, commas, and minus
      const cleanAmount = amountString.toString().replace(/[^\d.,-]/g, '');

      // Handle negative numbers (in parentheses or with minus sign)
      let isNegative = false;
      if (amountString.includes('(') && amountString.includes(')')) {
        isNegative = true;
      }

      // Convert to number
      const result = parseFloat(cleanAmount.replace(',', '.')) || 0;
      return isNegative ? -result : result;
    } catch (error) {
      console.error('Error parsing amount:', error);
      return 0;
    }
  }

  protected extractCategory(
    description: string,
    additionalInfo?: string,
  ): string | null {
    const textToSearch = `${description} ${additionalInfo || ''}`;

    // Look for category keywords
    for (const [keyword, category] of this.categoryMappings) {
      if (textToSearch.includes(keyword)) {
        return category;
      }
    }

    // Try to extract MCC (Merchant Category Code) information
    const mccRegex = /MCC:\s*(\d+)/;
    const mccMatch = mccRegex.exec(textToSearch);
    if (mccMatch) {
      return this.getMccCategory(mccMatch[1]);
    }

    return null;
  }

  private getMccCategory(mccCode: string): string {
    const mccMappings: { [key: string]: string } = {
      '5411': 'Groceries', // Grocery Stores, Supermarkets
      '5541': 'Fuel', // Service Stations
      '5812': 'Restaurants', // Eating Places, Restaurants
      '5814': 'Fast Food', // Fast Food Restaurants
      '4511': 'Transportation', // Airlines
      '4121': 'Transportation', // Taxicabs and Limousines
      '8011': 'Healthcare', // Doctors
      '5912': 'Pharmacy', // Drug Stores and Pharmacies
      '5651': 'Clothing', // Family Clothing Stores
      '5732': 'Electronics', // Electronics Stores
      '5945': 'Entertainment', // Hobby, Toy, and Game Shops
    };

    return mccMappings[mccCode] || 'Other';
  }
}
