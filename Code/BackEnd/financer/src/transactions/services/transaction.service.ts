import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Category } from '../entities/category.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CsvParserService, ParsedTransaction } from './csv-parser.service';

export interface TransactionStats {
  totalExpenses: number;
  totalIncome: number;
  expensesByCategory: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  monthlyTrends: { month: string; expenses: number; income: number }[];
  monthlyTrendsPerCategory: {
    category: string;
    trends: { month: string; amount: number }[];
  }[];
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly csvParserService: CsvParserService,
  ) {}

  // Transaction methods
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      userId,
      date: new Date(createTransactionDto.date),
      documentDate: createTransactionDto.documentDate
        ? new Date(createTransactionDto.documentDate)
        : null,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAllTransactions(
    userId: number,
    page = 1,
    limit = 50,
    categoryId?: number,
    type?: TransactionType,
    startDate?: string,
    endDate?: string,
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.date', 'DESC');

    if (categoryId) {
      queryBuilder.andWhere('transaction.categoryId = :categoryId', {
        categoryId,
      });
    }

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    const [transactions, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findTransactionById(id: number, userId: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    userId: number,
  ): Promise<Transaction> {
    const transaction = await this.findTransactionById(id, userId);

    Object.assign(transaction, {
      ...updateTransactionDto,
      date: updateTransactionDto.date
        ? new Date(updateTransactionDto.date)
        : transaction.date,
      documentDate: updateTransactionDto.documentDate
        ? new Date(updateTransactionDto.documentDate)
        : transaction.documentDate,
    });

    return this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: number, userId: number): Promise<void> {
    const transaction = await this.findTransactionById(id, userId);
    await this.transactionRepository.remove(transaction);
  }

  // Category methods
  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['transactions'],
      order: { name: 'ASC' },
    });
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  // CSV Import methods
  async importTransactionsFromCsv(
    csvContent: string,
    userId: number,
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    const parsedTransactions =
      await this.csvParserService.parseTransactionsFromCsv(csvContent);

    console.log('Parsed Transactions:', parsedTransactions);

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const parsedTransaction of parsedTransactions) {
      try {
        // Check if transaction already exists (by transaction ID or date + amount)
        const existingTransaction = await this.findExistingTransaction(
          parsedTransaction,
          userId,
        );

        if (existingTransaction) {
          skipped++;
          continue;
        }

        // Auto-assign category if detected
        let categoryId: number | undefined;
        if (parsedTransaction.detectedCategory) {
          const category = await this.findOrCreateCategory(
            parsedTransaction.detectedCategory,
          );
          categoryId = category.id;
        }

        // Create transaction
        await this.transactionRepository.save({
          ...parsedTransaction,
          userId,
          categoryId,
        });

        imported++;
      } catch (error) {
        errors.push(`Error importing transaction: ${error.message}`);
      }
    }

    return { imported, skipped, errors };
  }

  async importParsedTransactions(
    parsedTransactions: ParsedTransaction[],
    userId: number,
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    console.log('Importing parsed transactions:', parsedTransactions);

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const parsedTransaction of parsedTransactions) {
      try {
        // Check if transaction already exists (by transaction ID or date + amount)
        const existingTransaction = await this.findExistingTransaction(
          parsedTransaction,
          userId,
        );

        if (existingTransaction) {
          skipped++;
          continue;
        }

        // Auto-assign category if detected
        let categoryId: number | undefined;
        if (parsedTransaction.detectedCategory) {
          const category = await this.findOrCreateCategory(
            parsedTransaction.detectedCategory,
          );
          categoryId = category.id;
        }

        // Create new transaction
        const newTransaction = this.transactionRepository.create({
          userId,
          type: parsedTransaction.type,
          date: parsedTransaction.date,
          description: parsedTransaction.description,
          additionalInformation: parsedTransaction.additionalInformation,
          paidOut: parsedTransaction.paidOut,
          paidIn: parsedTransaction.paidIn,
          balance: parsedTransaction.balance,
          documentDate: parsedTransaction.documentDate,
          documentNumber: parsedTransaction.documentNumber,
          partnersAccount: parsedTransaction.partnersAccount,
          partnersName: parsedTransaction.partnersName,
          partnersTaxCode: parsedTransaction.partnersTaxCode,
          partnersBankCode: parsedTransaction.partnersBankCode,
          intermediaryBankCode: parsedTransaction.intermediaryBankCode,
          chargeDetails: parsedTransaction.chargeDetails,
          taxpayerCode: parsedTransaction.taxpayerCode,
          taxpayerName: parsedTransaction.taxpayerName,
          treasuryCode: parsedTransaction.treasuryCode,
          opCode: parsedTransaction.opCode,
          additionalDescription: parsedTransaction.additionalDescription,
          transactionId: parsedTransaction.transactionId,
          detectedCategory: parsedTransaction.detectedCategory,
          categoryId,
        });

        await this.transactionRepository.save(newTransaction);
        imported++;
      } catch (error) {
        errors.push(`Error importing transaction: ${error.message}`);
      }
    }

    return { imported, skipped, errors };
  }

  private async findExistingTransaction(
    parsedTransaction: ParsedTransaction,
    userId: number,
  ): Promise<Transaction | null> {
    // First try to find by transaction ID
    if (parsedTransaction.transactionId) {
      const byId = await this.transactionRepository.findOne({
        where: {
          transactionId: parsedTransaction.transactionId,
          userId,
        },
      });
      if (byId) return byId;
    }

    // Then try to find by date, amount, and description
    const byDetails = await this.transactionRepository.findOne({
      where: {
        date: parsedTransaction.date,
        paidOut: parsedTransaction.paidOut,
        paidIn: parsedTransaction.paidIn,
        description: parsedTransaction.description,
        userId,
      },
    });

    return byDetails;
  }

  private async findOrCreateCategory(categoryName: string): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category) {
      category = await this.categoryRepository.save({
        name: categoryName,
        description: `Auto-created category for ${categoryName}`,
      });
    }

    return category;
  }

  // Helper method to ensure date is a Date object
  private ensureDate(date: Date | string): Date {
    return date instanceof Date ? date : new Date(date);
  }

  // Helper method to ensure numeric values are properly converted
  private ensureNumber(value: number | string | null | undefined): number {
    if (value === null || value === undefined) return 0;
    return typeof value === 'string' ? parseFloat(value) || 0 : value || 0;
  }

  // Analytics methods
  async getTransactionStats(
    userId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<TransactionStats> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .where('transaction.userId = :userId', { userId });

    if (startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', {
        startDate: new Date(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', {
        endDate: new Date(endDate),
      });
    }

    const transactions = await queryBuilder.getMany();

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + this.ensureNumber(t.paidOut), 0);

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + this.ensureNumber(t.paidIn), 0);

    const expensesByCategory = this.groupExpensesByCategory(transactions);

    const monthlyTrends = this.calculateMonthlyTrends(transactions);

    const monthlyTrendsPerCategory =
      this.calculateMonthlyTrendsPerCategory(transactions);

    return {
      totalExpenses,
      totalIncome,
      expensesByCategory,
      monthlyTrends,
      monthlyTrendsPerCategory,
    };
  }

  private groupExpensesByCategory(transactions: Transaction[]): {
    category: string;
    amount: number;
    percentage: number;
  }[] {
    const expenses = transactions.filter(
      (t) => t.type === TransactionType.EXPENSE,
    );
    const totalExpenses = expenses.reduce(
      (sum, t) => sum + this.ensureNumber(t.paidOut),
      0,
    );

    const categoryTotals = new Map<string, number>();

    expenses.forEach((transaction) => {
      const categoryName =
        transaction.category?.name ||
        transaction.detectedCategory ||
        'Uncategorized';
      const amount = this.ensureNumber(transaction.paidOut);
      categoryTotals.set(
        categoryName,
        (categoryTotals.get(categoryName) || 0) + amount,
      );
    });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  private calculateMonthlyTrends(transactions: Transaction[]): {
    month: string;
    expenses: number;
    income: number;
  }[] {
    const monthlyData = new Map<string, { expenses: number; income: number }>();

    transactions.forEach((transaction) => {
      // Ensure date is a Date object
      const date = this.ensureDate(transaction.date);

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { expenses: 0, income: 0 });
      }

      const data = monthlyData.get(monthKey);
      if (!data) return;

      if (transaction.type === TransactionType.EXPENSE) {
        data.expenses += this.ensureNumber(transaction.paidOut);
      } else if (transaction.type === TransactionType.INCOME) {
        data.income += this.ensureNumber(transaction.paidIn);
      }
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private calculateMonthlyTrendsPerCategory(transactions: Transaction[]): {
    category: string;
    trends: { month: string; amount: number }[];
  }[] {
    const categoryMonthlyData = new Map<string, Map<string, number>>();

    // Group expenses by category and month
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((transaction) => {
        const date = this.ensureDate(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, '0')}`;

        const categoryName =
          transaction.category?.name ||
          transaction.detectedCategory ||
          'Uncategorized';

        if (!categoryMonthlyData.has(categoryName)) {
          categoryMonthlyData.set(categoryName, new Map<string, number>());
        }

        const categoryData = categoryMonthlyData.get(categoryName);
        if (!categoryData) return;

        const currentAmount = categoryData.get(monthKey) || 0;
        categoryData.set(
          monthKey,
          currentAmount + this.ensureNumber(transaction.paidOut),
        );
      });

    // Convert to the required format
    return Array.from(categoryMonthlyData.entries())
      .map(([category, monthlyData]) => ({
        category,
        trends: Array.from(monthlyData.entries())
          .map(([month, amount]) => ({
            month,
            amount,
          }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }
}
