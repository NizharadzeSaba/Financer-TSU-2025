import { Category } from '../entities/category.entity';

export const defaultCategories: Partial<Category>[] = [
  {
    name: 'Groceries',
    description: 'Food and grocery shopping',
    color: '#4CAF50',
  },
  {
    name: 'Restaurants',
    description: 'Dining out and restaurants',
    color: '#FF9800',
  },
  {
    name: 'Transportation',
    description: 'Public transport, taxis, gas',
    color: '#2196F3',
  },
  {
    name: 'Healthcare',
    description: 'Medical expenses and healthcare',
    color: '#F44336',
  },
  {
    name: 'Entertainment',
    description: 'Movies, games, recreation',
    color: '#9C27B0',
  },
  {
    name: 'Utilities',
    description: 'Electricity, water, internet, phone',
    color: '#607D8B',
  },
  {
    name: 'Shopping',
    description: 'Clothing, electronics, household items',
    color: '#E91E63',
  },
  {
    name: 'Education',
    description: 'Books, courses, tuition',
    color: '#00BCD4',
  },
  {
    name: 'Fuel',
    description: 'Gas and fuel for vehicles',
    color: '#795548',
  },
  {
    name: 'Pharmacy',
    description: 'Medicine and pharmacy purchases',
    color: '#FF5722',
  },
  {
    name: 'Coffee',
    description: 'Coffee shops and cafes',
    color: '#8BC34A',
  },
  {
    name: 'Fast Food',
    description: 'Quick service restaurants',
    color: '#FFC107',
  },
  {
    name: 'Income',
    description: 'Salary and other income',
    color: '#4CAF50',
  },
  {
    name: 'Transfer',
    description: 'Money transfers and account movements',
    color: '#9E9E9E',
  },
  {
    name: 'Other',
    description: 'Uncategorized expenses',
    color: '#757575',
  },
];
