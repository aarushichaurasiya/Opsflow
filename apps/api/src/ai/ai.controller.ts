import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('query')
  // @UseGuards(JwtAuthGuard) // In production, require valid session
  async query(@Body('prompt') prompt: string, @Req() req: any) {
    // In a real implementation, these are extracted from the JWT Auth context
    const userId = req.user?.id || 'mock-user-id';
    const organizationId = req.user?.organizationId || 'mock-org-id';

    return this.aiService.processQuery(prompt, userId, organizationId);
  }
}
