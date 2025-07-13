import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  additionalInformation: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidOut: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  paidIn: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'date', nullable: true })
  documentDate: Date;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  partnersAccount: string;

  @Column({ nullable: true })
  partnersName: string;

  @Column({ nullable: true })
  partnersTaxCode: string;

  @Column({ nullable: true })
  partnersBankCode: string;

  @Column({ nullable: true })
  intermediaryBankCode: string;

  @Column({ type: 'text', nullable: true })
  chargeDetails: string;

  @Column({ nullable: true })
  taxpayerCode: string;

  @Column({ nullable: true })
  taxpayerName: string;

  @Column({ nullable: true })
  treasuryCode: string;

  @Column({ nullable: true })
  opCode: string;

  @Column({ type: 'text', nullable: true })
  additionalDescription: string;

  @Column({ nullable: true })
  transactionId: string;

  // Auto-detected category from merchant name or description
  @Column({ nullable: true })
  detectedCategory: string;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Helper method to get transaction amount
  get amount(): number {
    const paidOut =
      typeof this.paidOut === 'string'
        ? parseFloat(this.paidOut)
        : this.paidOut;
    const paidIn =
      typeof this.paidIn === 'string' ? parseFloat(this.paidIn) : this.paidIn;
    return paidOut || paidIn || 0;
  }

  // Helper method to determine if this is an expense
  get isExpense(): boolean {
    const paidOut =
      typeof this.paidOut === 'string'
        ? parseFloat(this.paidOut)
        : this.paidOut;
    return (paidOut || 0) > 0;
  }

  // Helper method to determine if this is income
  get isIncome(): boolean {
    const paidIn =
      typeof this.paidIn === 'string' ? parseFloat(this.paidIn) : this.paidIn;
    return (paidIn || 0) > 0;
  }
}
