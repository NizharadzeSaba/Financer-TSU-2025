import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SuggestionService } from './suggestion.service';
import { SuggestionController } from './suggestion.controller';
import { TransactionModule } from '../transactions/transaction.module';

@Module({
  imports: [ConfigModule, TransactionModule],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [SuggestionService],
})
export class SuggestionModule {}
