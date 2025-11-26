import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransferDto } from './dto/transfer.dto';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { ApprovePayoutDto } from './dto/approve-payout.dto';
import { JwtAuthGuard } from '@byob/nest-common';

@Controller('wallet')
export class WalletController {
  constructor(private readonly wallet: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getWallet(@Param('userId') userId: string) {
    return this.wallet.getWalletByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('transfer')
  transfer(@Body() dto: TransferDto) {
    return this.wallet.transfer(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payout')
  requestPayout(@Body() dto: CreatePayoutDto) {
    return this.wallet.requestPayout(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('payouts/all')
  listPayouts() {
    return this.wallet.listPayouts();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('payouts/:id')
  approve(@Param('id') id: string, @Body() dto: ApprovePayoutDto) {
    return this.wallet.updatePayoutStatus(id, dto);
  }
}
