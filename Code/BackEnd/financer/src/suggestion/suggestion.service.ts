import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TransactionStats } from '../transactions/services/transaction.service';

export interface SpendingSuggestion {
  category: string;
  suggestion: string;
  potentialSavings?: number;
  priority: 'high' | 'medium' | 'low';
}

@Injectable()
export class SuggestionService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async generateSpendingSuggestions(
    stats: TransactionStats,
  ): Promise<SpendingSuggestion[]> {
    let rawResponse: string | undefined;

    try {
      const prompt = this.buildPrompt(stats);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // or 'gpt-3.5-turbo' for cost optimization
        messages: [
          {
            role: 'system',
            content: `You are a personal finance advisor. Analyze spending data and provide actionable suggestions to improve financial health. 
            
            IMPORTANT: Return ONLY a valid JSON array. Do not wrap your response in markdown code blocks or any other formatting.
            
            Return your response as a JSON array of suggestions with this exact structure:
            [
              {
                "category": "string",
                "suggestion": "string", 
                "potentialSavings": number,
                "priority": "high" | "medium" | "low"
              }
            ]
            
            Focus on:
            - Categories with highest spending
            - Unusual spending patterns
            - Practical money-saving tips
            - Budget optimization
            
            Keep suggestions specific, actionable, and realistic. Limit to 3-5 suggestions maximum.
            
            Remember: Return ONLY the JSON array, nothing else.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      rawResponse = completion.choices[0]?.message?.content;
      if (!rawResponse) {
        throw new Error('No response from OpenAI');
      }

      // Extract JSON from markdown code blocks if present
      const jsonContent = this.extractJsonFromResponse(rawResponse);

      // Parse the JSON response
      const suggestions = JSON.parse(jsonContent) as SpendingSuggestion[];

      // Validate that we got an array
      if (!Array.isArray(suggestions)) {
        throw new Error('OpenAI response is not an array');
      }

      return suggestions;
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      if (error instanceof SyntaxError && rawResponse) {
        console.error('Invalid JSON response from OpenAI:', rawResponse);
      }
    }
  }

  private extractJsonFromResponse(response: string): string {
    // Remove markdown code blocks if present
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const jsonMatch = jsonRegex.exec(response);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }

    // Remove generic code blocks if present
    const codeRegex = /```\s*([\s\S]*?)\s*```/;
    const codeMatch = codeRegex.exec(response);
    if (codeMatch) {
      return codeMatch[1].trim();
    }

    // Return the response as-is if no code blocks found
    return response.trim();
  }

  private buildPrompt(stats: TransactionStats): string {
    const { totalExpenses, totalIncome, expensesByCategory, monthlyTrends } =
      stats;

    const categoryBreakdown = expensesByCategory
      .map(
        (cat) =>
          `${cat.category}: $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%)`,
      )
      .join('\n');

    const recentTrends = monthlyTrends
      .slice(-3) // Last 3 months
      .map(
        (trend) =>
          `${trend.month}: Expenses $${trend.expenses.toFixed(2)}, Income $${trend.income.toFixed(2)}`,
      )
      .join('\n');

    return `
        Analyze this user's financial data and provide 3-5 personalized spending improvement suggestions:

        FINANCIAL OVERVIEW:
        - Total Monthly Expenses: $${totalExpenses.toFixed(2)}
        - Total Monthly Income: $${totalIncome.toFixed(2)}
        - Savings Rate: ${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%

        SPENDING BY CATEGORY:
        ${categoryBreakdown}

        RECENT MONTHLY TRENDS:
        ${recentTrends}

        Please provide specific, actionable suggestions to help this user optimize their spending and improve their financial health.
    `;
  }
}
