import { IsNumber, IsString } from 'class-validator';

export class ScoreConversationDto {
  @IsString()
  conversationId!: string;

  @IsString()
  agentId!: string;

  @IsNumber()
  sentiment!: number;

  @IsNumber()
  clarity!: number;

  @IsNumber()
  empathy!: number;

  @IsNumber()
  solutionPatterns!: number;

  @IsNumber()
  tone!: number;

  @IsNumber()
  responseTime!: number;

  @IsNumber()
  correctLinkUse!: number;

  @IsNumber()
  format!: number;

  @IsNumber()
  adaptabilitySignals!: number;
}
