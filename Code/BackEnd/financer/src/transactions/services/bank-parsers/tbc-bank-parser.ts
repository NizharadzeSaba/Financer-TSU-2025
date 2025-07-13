import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse';
import { TransactionType } from '../../entities/transaction.entity';
import { BaseBankParser, BankType } from './base-bank-parser';
import { ParsedTransaction } from '../csv-parser.service';

@Injectable()
export class TbcBankParser extends BaseBankParser {
  readonly bankType = BankType.TBC;
  readonly categoryMappings = new Map<string, string>([
    ['სასურსათო მაღაზიები', 'Groceries'],
    ['ავტობენზინი', 'Fuel'],
    ['რესტორანი', 'Restaurants'],
    ['კაფე', 'Coffee'],
    ['ტრანსპორტი', 'Transportation'],
    ['სამედიცინო', 'Healthcare'],
    ['განათლება', 'Education'],
    ['გართობა', 'Entertainment'],
    ['ტანისამოსი', 'Clothing'],
    ['ფარმაცია', 'Pharmacy'],
    ['კომუნალური', 'Utilities'],
    ['მობილური', 'Mobile'],
    ['ინტერნეტი', 'Internet'],
  ]);

  canParse(csvContent: string): boolean {
    const lines = csvContent.split('\n');
    if (lines.length < 2) return false;

    // TBC format detection:
    // - Has dual headers (Georgian + English)
    // - English headers contain "Date", "Paid Out", "Paid In", etc.
    const firstLine = lines[0].toLowerCase();
    const secondLine = lines[1].toLowerCase();

    return (
      (firstLine.includes('თარიღი') && secondLine.includes('date')) ||
      secondLine.includes('paid out') ||
      secondLine.includes('paid in') ||
      secondLine.includes('balance')
    );
  }

  async parseTransactions(csvContent: string): Promise<ParsedTransaction[]> {
    return new Promise((resolve, reject) => {
      const transactions: ParsedTransaction[] = [];

      console.log('Parsing TBC bank statement...');

      // Handle dual headers (Georgian + English) by skipping the first Georgian header row
      const lines = csvContent.split('\n');
      if (lines.length >= 2) {
        const firstLine = lines[0];
        const secondLine = lines[1];

        if (firstLine.includes('თარიღი') && secondLine.includes('Date')) {
          console.log('Detected dual headers, skipping Georgian header');
          csvContent = lines.slice(1).join('\n');
        }
      }

      parse(csvContent, {
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
            console.error('Error parsing TBC row:', row, error);
          }
        })
        .on('end', () => {
          console.log(`Parsed ${transactions.length} TBC transactions`);
          resolve(transactions);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private parseTransactionRow(row: any): ParsedTransaction | null {
    try {
      // Parse date (format: DD/MM/YYYY)
      const date = this.parseDate(row['Date']);
      if (!date) {
        console.log('Skipping TBC row due to invalid date');
        return null;
      }

      // Parse amounts
      const paidOut = this.parseAmount(row['Paid Out']);
      const paidIn = this.parseAmount(row['Paid In']);
      const balance = this.parseAmount(row['Balance']);

      // Determine transaction type
      let type: TransactionType;
      if (paidOut > 0) {
        type = TransactionType.EXPENSE;
      } else if (paidIn > 0) {
        type = TransactionType.INCOME;
      } else {
        type = TransactionType.TRANSFER;
      }

      // Extract category
      const detectedCategory = this.extractCategory(
        row['Description'] ?? '',
        row['Additional Information'],
      );

      const transaction: ParsedTransaction = {
        date,
        description: row['Description'] ?? '',
        additionalInformation: row['Additional Information'],
        paidOut,
        paidIn,
        balance,
        type,
        documentDate: this.parseDate(row['Document Date']),
        documentNumber: row['Document Number'],
        partnersAccount: row["Partner's Account"],
        partnersName: row["Partner's Name"],
        partnersTaxCode: row["Partner's Tax Code"],
        partnersBankCode: row["Partner's Bank Code"],
        intermediaryBankCode: row['Intermediary Bank Code'],
        chargeDetails: row['Charge Details'],
        taxpayerCode: row['Taxpayer Code'],
        taxpayerName: row['Taxpayer Name'],
        treasuryCode: row['Treasury Code'],
        opCode: row['Op. Code'],
        additionalDescription: row['Additional Description'],
        transactionId: row['Transaction ID'],
        detectedCategory,
      };

      return transaction;
    } catch (error) {
      console.error('Error parsing TBC transaction row:', error);
      return null;
    }
  }
}
