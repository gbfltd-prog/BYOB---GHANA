import { Injectable } from '@nestjs/common';
import { PrismaService } from '@byob/prisma';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';

@Injectable()
export class ManufacturersService {
  constructor(private readonly prisma: PrismaService) {}

  register(dto: CreateManufacturerDto) {
    return this.prisma.manufacturerProfile.upsert({
      where: { userId: dto.userId },
      update: {
        businessName: dto.businessName,
        description: dto.description,
        verified: dto.verified ?? false,
      },
      create: {
        userId: dto.userId,
        businessName: dto.businessName,
        description: dto.description,
        verified: dto.verified ?? false,
      },
    });
  }

  list() {
    return this.prisma.manufacturerProfile.findMany();
  }
}
