import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoreConversationDto } from './dto/score-conversation.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scores: ScoresService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  scoreConversation(@Body() dto: ScoreConversationDto) {
    return this.scores.scoreConversation(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':agentId')
  list(@Param('agentId') agentId: string) {
    return this.scores.listForAgent(agentId);
  }

  @Get()
  leaderboard() {
    return this.scores.leaderboard();
  }
}
