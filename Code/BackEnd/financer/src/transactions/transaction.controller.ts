import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import {
  TransactionService,
  TransactionStats,
} from './services/transaction.service';
import { CsvParserService } from './services/csv-parser.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly csvParserService: CsvParserService,
  ) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @CurrentUser() user: any,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(
      createTransactionDto,
      user.userId,
    );
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all transactions with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: TransactionType })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async findAllTransactions(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: number,
    @Query('type') type?: TransactionType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.transactionService.findAllTransactions(
      user.userId,
      page,
      limit,
      categoryId,
      type,
      startDate,
      endDate,
    );
  }

  @Get('stats')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Get transaction statistics and analytics including monthly trends per category',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalExpenses: { type: 'number' },
        totalIncome: { type: 'number' },
        expensesByCategory: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              amount: { type: 'number' },
              percentage: { type: 'number' },
            },
          },
        },
        monthlyTrends: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              month: { type: 'string' },
              expenses: { type: 'number' },
              income: { type: 'number' },
            },
          },
        },
        monthlyTrendsPerCategory: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              trends: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    month: { type: 'string' },
                    amount: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getTransactionStats(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<TransactionStats> {
    return this.transactionService.getTransactionStats(
      user.userId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findTransactionById(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transaction> {
    return this.transactionService.findTransactionById(id, user.userId);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  async updateTransaction(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateTransaction(
      id,
      updateTransactionDto,
      user.userId,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction deleted successfully' })
  async deleteTransaction(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.transactionService.deleteTransaction(id, user.userId);
  }

  @Post('categories')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.transactionService.createCategory(createCategoryDto);
  }

  @Get('categories/all')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  async findAllCategories(): Promise<Category[]> {
    return this.transactionService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return this.transactionService.findCategoryById(id);
  }

  @Patch('categories/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.transactionService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transactionService.deleteCategory(id);
  }

  // Supported Banks endpoint
  @Get('banks/supported')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get supported banks for transaction import' })
  @ApiResponse({
    status: 200,
    description: 'Supported banks retrieved successfully',
  })
  async getSupportedBanks(): Promise<any> {
    return this.csvParserService.getSupportedBanks();
  }

  // Bank-specific CSV Import endpoint
  @Post('import/csv/:bankCode')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Import transactions from CSV file for a specific bank',
  })
  @ApiBody({
    description: 'CSV file containing transactions to import',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file to upload',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'CSV imported successfully' })
  async importTransactionsFromBankCsv(
    @CurrentUser() user: any,
    @UploadedFile() file: Express.Multer.File,
    @Param('bankCode') bankCode: string,
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const csvContent = file.buffer.toString('utf-8');

    // Parse with specific bank type
    const parsedTransactions =
      await this.csvParserService.parseTransactionsWithBankType(
        csvContent,
        bankCode,
      );

    // Import the parsed transactions
    return this.transactionService.importParsedTransactions(
      parsedTransactions,
      user.userId,
    );
  }
}
