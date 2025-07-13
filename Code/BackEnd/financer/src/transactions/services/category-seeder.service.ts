import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { defaultCategories } from '../seeds/default-categories';

@Injectable()
export class CategorySeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seedDefaultCategories(): Promise<void> {
    const existingCategories = await this.categoryRepository.count();

    // Only seed if no categories exist
    if (existingCategories === 0) {
      await this.categoryRepository.save(defaultCategories);
      console.log('Default categories seeded successfully');
    }
  }
}
