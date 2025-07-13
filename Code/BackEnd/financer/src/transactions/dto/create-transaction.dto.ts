import {
  IsDateString,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Transaction date in ISO string format',
    example: '2024-01-15',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Payment for services',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Additional information about the transaction',
    example: 'Monthly subscription payment',
  })
  @IsOptional()
  @IsString()
  additionalInformation?: string;

  @ApiPropertyOptional({
    description: 'Amount paid out (for expenses)',
    example: 150.5,
  })
  @IsOptional()
  @IsNumber()
  paidOut?: number;

  @ApiPropertyOptional({
    description: 'Amount paid in (for income)',
    example: 1200,
  })
  @IsOptional()
  @IsNumber()
  paidIn?: number;

  @ApiProperty({
    description: 'Account balance after transaction',
    example: 2500.75,
  })
  @IsNumber()
  balance: number;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.EXPENSE,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiPropertyOptional({
    description: 'Document date for the transaction',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  documentDate?: string;

  @ApiPropertyOptional({
    description: 'Document number or reference',
    example: 'INV-2024-001',
  })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({
    description: "Partner's bank account number",
    example: 'GE83TB1234567890123456',
  })
  @IsOptional()
  @IsString()
  partnersAccount?: string;

  @ApiPropertyOptional({
    description: "Partner's name",
    example: 'ABC Company Ltd',
  })
  @IsOptional()
  @IsString()
  partnersName?: string;

  @ApiPropertyOptional({
    description: "Partner's tax code",
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  partnersTaxCode?: string;

  @ApiPropertyOptional({
    description: "Partner's bank code",
    example: 'TBCBGE22',
  })
  @IsOptional()
  @IsString()
  partnersBankCode?: string;

  @ApiPropertyOptional({
    description: 'Intermediary bank code',
    example: 'SWIFT123',
  })
  @IsOptional()
  @IsString()
  intermediaryBankCode?: string;

  @ApiPropertyOptional({
    description: 'Transaction charge details',
    example: 'Service fee: 2.50',
  })
  @IsOptional()
  @IsString()
  chargeDetails?: string;

  @ApiPropertyOptional({
    description: 'Taxpayer identification code',
    example: '987654321',
  })
  @IsOptional()
  @IsString()
  taxpayerCode?: string;

  @ApiPropertyOptional({
    description: 'Taxpayer name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  taxpayerName?: string;

  @ApiPropertyOptional({
    description: 'Treasury code for government transactions',
    example: 'TREAS001',
  })
  @IsOptional()
  @IsString()
  treasuryCode?: string;

  @ApiPropertyOptional({
    description: 'Operation code',
    example: 'OP123',
  })
  @IsOptional()
  @IsString()
  opCode?: string;

  @ApiPropertyOptional({
    description: 'Additional description for the transaction',
    example: 'Quarterly payment for consulting services',
  })
  @IsOptional()
  @IsString()
  additionalDescription?: string;

  @ApiPropertyOptional({
    description: 'Unique transaction identifier',
    example: 'TXN-2024-001-456789',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Auto-detected category name',
    example: 'Utilities',
  })
  @IsOptional()
  @IsString()
  detectedCategory?: string;

  @ApiPropertyOptional({
    description: 'Category ID for transaction classification',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
