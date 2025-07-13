import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SuggestionService, SpendingSuggestion } from './suggestion.service';
import { TransactionService } from '../transactions/services/transaction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('suggestions')
@Controller('suggestions')
export class SuggestionController {
  constructor(
    private readonly suggestionService: SuggestionService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get('ai-spending')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get AI-powered spending improvement suggestions' })
  @ApiResponse({
    status: 200,
    description: 'AI suggestions retrieved successfully',
  })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getAiSpendingSuggestions(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<SpendingSuggestion[]> {
    const stats = await this.transactionService.getTransactionStats(
      user.userId,
      startDate,
      endDate,
    );

    return this.suggestionService.generateSpendingSuggestions(stats);
  }
}
