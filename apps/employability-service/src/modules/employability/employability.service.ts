import { Injectable } from '@nestjs/common';
import { prisma } from '@byob/db';
import Redis from 'ioredis';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { createWriteStream, promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class EmployabilityService {
  private sub = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

  constructor() {
    this.listen();
  }

  async listen() {
    await this.sub.subscribe('chat_events');
    this.sub.on('message', async (_channel, message) => {
      const evt = JSON.parse(message);
      await this.handleChatEvent(evt);
    });
  }

  private scoreFromMessage(content: string): { sentiment: number; clarity: number; empathy: number; tone: number; responseTime: number; correctLinkUse: number; format: number; adaptabilitySignals: number; } {
    const len = content.length;
    const sentiment = Math.min(5, 1 + len / 50);
    const clarity = Math.min(5, 1 + len / 60);
    const empathy = content.toLowerCase().includes('please') ? 4.5 : 3.0;
    const tone = 3.5;
    const responseTime = 4.0;
    const correctLinkUse = content.includes('http') ? 4.0 : 3.0;
    const format = content.endsWith('.') ? 4.2 : 3.5;
    const adaptabilitySignals = content.toLowerCase().includes('can') ? 4.0 : 3.2;
    return { sentiment, clarity, empathy, tone, responseTime, correctLinkUse, format, adaptabilitySignals };
  }

  private computeWeighted(scores: { sentiment: number; clarity: number; empathy: number; tone: number; responseTime: number; correctLinkUse: number; format: number; adaptabilitySignals: number; }) {
    const communication = (scores.sentiment + scores.clarity + scores.empathy) / 3;
    const problemSolving = scores.adaptabilitySignals; // proxy
    const professionalism = (scores.tone + scores.responseTime) / 2;
    const digitalFluency = (scores.correctLinkUse + scores.format) / 2;
    const teamwork = scores.adaptabilitySignals;
    const weighted = 0.25*communication + 0.20*problemSolving + 0.20*professionalism + 0.15*digitalFluency + 0.20*teamwork;
    return { communication, problemSolving, professionalism, digitalFluency, teamwork, weightedScore: weighted };
  }

  async handleChatEvent(evt: { conversationId: string; senderId: string; content: string; }) {
    const s = this.scoreFromMessage(evt.content);
    const combined = this.computeWeighted(s);
    const score = await prisma.employabilityScore.create({ data: {
      userId: evt.senderId,
      conversationId: evt.conversationId,
      communication: combined.communication,
      problemSolving: combined.problemSolving,
      professionalism: combined.professionalism,
      digitalFluency: combined.digitalFluency,
      teamwork: combined.teamwork,
      weightedScore: combined.weightedScore
    }});
    if (combined.weightedScore >= 4.0) {
      const url = await this.generateCertificate(score.userId, combined.weightedScore);
      await prisma.employabilityScore.update({ where: { id: score.id }, data: { certificateUrl: url } });
    }
  }

  async generateCertificate(userId: string, score: number) {
    const dir = join(process.cwd(), 'certs');
    await fs.mkdir(dir, { recursive: true });
    const file = join(dir, `${userId}.pdf`);
    const doc = new PDFDocument();
    const stream = doc.pipe(createWriteStream(file));
    doc.fontSize(24).text('Klloyds/BYOB Certificate of Competency', { align: 'center' });
    doc.moveDown().fontSize(16).text(`User: ${userId}`);
    doc.text(`Score: ${score.toFixed(2)} / 5.00`);
    const qr = await QRCode.toDataURL(`byob-cert:${userId}`);
    const qrData = qr.replace(/^data:image\/png;base64,/, '');
    const qrBuffer = Buffer.from(qrData, 'base64');
    doc.addPage();
    doc.image(qrBuffer, 50, 50, { width: 200 });
    doc.end();
    await new Promise((res) => stream.on('finish', res));
    return `/certs/${userId}.pdf`;
  }

  async listUserScores(userId: string) {
    return prisma.employabilityScore.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
}
