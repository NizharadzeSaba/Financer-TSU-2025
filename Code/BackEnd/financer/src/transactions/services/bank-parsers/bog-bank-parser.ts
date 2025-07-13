import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { TransactionType } from '../../entities/transaction.entity';
import { BaseBankParser, BankType } from './base-bank-parser';
import { ParsedTransaction } from '../csv-parser.service';

@Injectable()
export class BogBankParser extends BaseBankParser {
  readonly bankType = BankType.BOG;
  readonly categoryMappings = new Map<string, string>([
    // Transportation patterns
    ['მიკროავტობუსი', 'Transportation'],
    ['ავტობუსი', 'Transportation'],
    ['მეტრო', 'Transportation'],
    ['ტაქსი', 'Transportation'],

    // Grocery and food
    ['სუპერმარკეტი', 'Groceries'],
    ['მაღაზია', 'Groceries'],
    ['რესტორანი', 'Restaurants'],
    ['კაფე', 'Coffee'],
    ['ფაუჭი', 'Restaurants'],

    // Utilities and services
    ['ელ.ენერგია', 'Utilities'],
    ['გაზი', 'Utilities'],
    ['წყალი', 'Utilities'],
    ['ინტერნეტი', 'Internet'],
    ['მობილური', 'Mobile'],
    ['ტელეფონი', 'Mobile'],

    // Healthcare and pharmacy
    ['ჰოსპიტალი', 'Healthcare'],
    ['კლინიკა', 'Healthcare'],
    ['ფარმაცია', 'Pharmacy'],
    ['აფთიაქი', 'Pharmacy'],

    // Entertainment and shopping
    ['კინო', 'Entertainment'],
    ['თეატრი', 'Entertainment'],
    ['ტანისამოსი', 'Clothing'],
    ['მაღაზია', 'Shopping'],

    // Fuel
    ['ბენზინი', 'Fuel'],
    ['დიზელი', 'Fuel'],
    ['საწვავი', 'Fuel'],
  ]);

  canParse(csvContent: string): boolean {
    const lines = csvContent.split('\n');
    if (lines.length < 1) return false;

    // BOG format detection:
    // - Georgian headers: თარიღი,დანიშნულება,,GEL,USD,EUR,GBP
    // - Single header row (no dual headers like TBC)
    const firstLine = lines[0].toLowerCase();

    return (
      firstLine.includes('თარიღი') &&
      firstLine.includes('დანიშნულება') &&
      firstLine.includes('gel') &&
      !lines[1]?.toLowerCase().includes('date') // Not TBC dual header
    );
  }

  async parseTransactions(csvContent: string): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: ParsedTransaction[] = [];

      console.log('Parsing BOG bank statement...');

      // Clean up the CSV content - remove BOM and normalize line endings
      let cleanedContent = csvContent;

      // Remove BOM if present
      if (cleanedContent.charCodeAt(0) === 0xfeff) {
        cleanedContent = cleanedContent.slice(1);
        console.log('Removed BOM from CSV content');
      }

      // Normalize line endings
      cleanedContent = cleanedContent
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');

      parse(cleanedContent, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ',',
        quote: '"',
        escape: '"',
        relax_column_count: true,
        trim: true,
      })
        .on('data', (row) => {
          try {
            const transaction = this.parseTransactionRow(row);
            if (transaction) {
              transactions.push(transaction);
            }
          } catch (error) {
            console.error('Error parsing BOG row:', row, error);
          }
        })
        .on('end', () => {
          console.log(`Parsed ${transactions.length} BOG transactions`);
          resolve(transactions);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private parseTransactionRow(row: any): ParsedTransaction | null {
    try {
      // BOG CSV structure: თარიღი,დანიშნულება,,GEL,USD,EUR,GBP
      const dateField = row['თარიღი'];
      const descriptionField = row['დანიშნულება'];
      const gelAmount = row['GEL'];
      const usdAmount = row['USD'];
      const eurAmount = row['EUR'];
      const gbpAmount = row['GBP'];

      // Parse date (format: DD/MM/YYYY)
      const date = this.parseDate(dateField);

      // Determine the main currency amount (prioritize GEL, then others)
      let amount = 0;
      if (gelAmount && gelAmount.trim() !== '') {
        amount = this.parseAmount(gelAmount);
      } else if (usdAmount && usdAmount.trim() !== '') {
        amount = this.parseAmount(usdAmount);
      } else if (eurAmount && eurAmount.trim() !== '') {
        amount = this.parseAmount(eurAmount);
      } else if (gbpAmount && gbpAmount.trim() !== '') {
        amount = this.parseAmount(gbpAmount);
      }

      // Determine transaction type and amounts
      let type: TransactionType;
      let paidOut = 0;
      let paidIn = 0;

      if (amount < 0) {
        type = TransactionType.EXPENSE;
        paidOut = Math.abs(amount);
      } else if (amount > 0) {
        type = TransactionType.INCOME;
        paidIn = amount;
      } else {
        type = TransactionType.TRANSFER;
      }

      // Extract category from description
      const detectedCategory = this.extractCategory(descriptionField ?? '');

      const transaction: ParsedTransaction = {
        date,
        description: descriptionField ?? '',
        additionalInformation: undefined, // BOG doesn't have separate additional info field
        paidOut,
        paidIn,
        balance: 0, // BOG format doesn't include running balance
        type,
        documentDate: undefined,
        documentNumber: undefined,
        partnersAccount: undefined,
        partnersName: undefined,
        partnersTaxCode: undefined,
        partnersBankCode: undefined,
        intermediaryBankCode: undefined,
        chargeDetails: undefined,
        taxpayerCode: undefined,
        taxpayerName: undefined,
        treasuryCode: undefined,
        opCode: undefined,
        additionalDescription: undefined,
        transactionId: undefined,
        detectedCategory,
      };

      return transaction;
    } catch (error) {
      console.error('Error parsing BOG transaction row:', error);
      return null;
    }
  }
}
