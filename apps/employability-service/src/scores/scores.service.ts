import { Injectable } from '@nestjs/common';
import { PrismaService } from '@byob/prisma';
import { ScoreConversationDto } from './dto/score-conversation.dto';

@Injectable()
export class ScoresService {
  constructor(private readonly prisma: PrismaService) {}

  async scoreConversation(dto: ScoreConversationDto) {
    const communication = this.average([dto.sentiment, dto.clarity, dto.empathy]);
    const problemSolving = dto.solutionPatterns;
    const professionalism = this.average([dto.tone, dto.responseTime]);
    const digitalFluency = this.average([dto.correctLinkUse, dto.format]);
    const teamwork = dto.adaptabilitySignals;

    const weightedScore =
      0.25 * communication +
      0.2 * problemSolving +
      0.2 * professionalism +
      0.15 * digitalFluency +
      0.2 * teamwork;

    const certificateUrl = weightedScore >= 4 ? this.buildCertificateUrl(dto.agentId, weightedScore) : undefined;

    return this.prisma.employabilityScore.create({
      data: {
        conversationId: dto.conversationId,
        agentId: dto.agentId,
        communication,
        problemSolving,
        professionalism,
        digitalFluency,
        teamwork,
        weightedScore,
        certificateUrl,
      },
    });
  }

  listForAgent(agentId: string) {
    return this.prisma.employabilityScore.findMany({ where: { agentId }, orderBy: { createdAt: 'desc' } });
  }

  leaderboard() {
    return this.prisma.employabilityScore.findMany({ orderBy: { weightedScore: 'desc' }, take: 10 });
  }

  private average(values: number[]) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  private buildCertificateUrl(agentId: string, score: number) {
    return `${process.env.CERT_BASE_URL || 'https://cdn.byob.africa/certs'}/${agentId}-${score.toFixed(2)}.pdf`;
  }
}
