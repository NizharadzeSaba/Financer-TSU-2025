import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Transaction } from './src/transactions/entities/transaction.entity';
import { Category } from './src/transactions/entities/category.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USER || 'financer_user',
  password: process.env.DATABASE_PASSWORD || 'financer_password',
  database: process.env.DATABASE_NAME || 'financer_db',
  entities: [User, Transaction, Category],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
