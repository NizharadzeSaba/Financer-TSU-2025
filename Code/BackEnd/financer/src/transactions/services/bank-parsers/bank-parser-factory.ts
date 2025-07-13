import { Injectable } from '@nestjs/common';
import { BaseBankParser } from './base-bank-parser';
import { TbcBankParser } from './tbc-bank-parser';
import { BogBankParser } from './bog-bank-parser';

@Injectable()
export class BankParserFactory {
  private readonly parsers: BaseBankParser[];

  constructor(
    private readonly tbcParser: TbcBankParser,
    private readonly bogParser: BogBankParser,
  ) {
    this.parsers = [this.tbcParser, this.bogParser];
  }

  getParser(csvContent: string): BaseBankParser {
    console.log('Detecting bank type from CSV content...');

    for (const parser of this.parsers) {
      if (parser.canParse(csvContent)) {
        console.log(`Detected ${parser.bankType} format`);
        return parser;
      }
    }

    // Default to TBC if no specific format is detected
    console.log('No specific bank format detected, defaulting to TBC');
    return this.tbcParser;
  }

  getAllParsers(): BaseBankParser[] {
    return this.parsers;
  }

  getParserByType(bankType: string): BaseBankParser | null {
    return (
      this.parsers.find(
        (parser) => parser.bankType.toLowerCase() === bankType.toLowerCase(),
      ) || null
    );
  }
}
