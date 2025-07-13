import { Injectable } from '@nestjs/common';
import { TransactionType } from '../entities/transaction.entity';
import { BankParserFactory } from './bank-parsers';

export interface ParsedTransaction {
  date: Date;
  description: string;
  additionalInformation?: string;
  paidOut?: number;
  paidIn?: number;
  balance: number;
  type: TransactionType;
  documentDate?: Date;
  documentNumber?: string;
  partnersAccount?: string;
  partnersName?: string;
  partnersTaxCode?: string;
  partnersBankCode?: string;
  intermediaryBankCode?: string;
  chargeDetails?: string;
  taxpayerCode?: string;
  taxpayerName?: string;
  treasuryCode?: string;
  opCode?: string;
  additionalDescription?: string;
  transactionId?: string;
  detectedCategory?: string;
}

@Injectable()
export class CsvParserService {
  constructor(private readonly bankParserFactory: BankParserFactory) {}

  async parseTransactionsFromCsv(
    csvContent: string,
  ): Promise<ParsedTransaction[]> {
    console.log('Starting CSV parsing...');
    console.log('CSV Content preview:', csvContent.substring(0, 500));

    // Get the appropriate parser based on the CSV format
    const parser = this.bankParserFactory.getParser(csvContent);

    // Parse transactions using the detected parser
    return parser.parseTransactions(csvContent);
  }

  async parseTransactionsWithBankType(
    csvContent: string,
    bankType: string,
  ): Promise<ParsedTransaction[]> {
    console.log(`Parsing CSV with specific bank type: ${bankType}`);

    const parser = this.bankParserFactory.getParserByType(bankType);
    if (!parser) {
      throw new Error(`Unsupported bank type: ${bankType}`);
    }

    return parser.parseTransactions(csvContent);
  }

  getSupportedBanks(): string[] {
    return this.bankParserFactory
      .getAllParsers()
      .map((parser) => parser.bankType);
  }
}
