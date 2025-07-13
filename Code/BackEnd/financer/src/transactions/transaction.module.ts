import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './services/transaction.service';
import { CsvParserService } from './services/csv-parser.service';
import { CategorySeederService } from './services/category-seeder.service';
import {
  TbcBankParser,
  BogBankParser,
  BankParserFactory,
} from './services/bank-parsers';
import { Transaction } from './entities/transaction.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Category])],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    CsvParserService,
    CategorySeederService,
    TbcBankParser,
    BogBankParser,
    BankParserFactory,
  ],
  exports: [TransactionService],
})
export class TransactionModule implements OnModuleInit {
  constructor(private readonly categorySeederService: CategorySeederService) {}

  async onModuleInit() {
    await this.categorySeederService.seedDefaultCategories();
  }
}
