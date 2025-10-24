import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('me')
  me(@Req() req: any) { return this.service.me(req.user.id); }

  @Post('transfer')
  transfer(@Req() req: any, @Body() body: { toEmail: string; amount: number; }) { return this.service.transfer(req.user.id, body.toEmail, body.amount); }

  @Post('payouts')
  payout(@Req() req: any, @Body() body: { amount: number; }) { return this.service.requestPayout(req.user.id, body.amount); }

  @Get('payouts')
  listPayouts(@Req() req: any) { return this.service.listPayouts(req.user.id); }

  @Post('payouts/:id/approve')
  approve(@Req() req: any, @Param('id') id: string) { return this.service.approvePayout(id, req.user.id, req.user.role); }

  @Post('payouts/:id/reject')
  reject(@Req() req: any, @Param('id') id: string) { return this.service.rejectPayout(id, req.user.id, req.user.role); }

  @Post('credit-commission')
  creditCommission(@Body() body: { userId: string; amount: number; orderId: string; }) { return this.service.creditCommission(body.userId, body.amount, body.orderId); }
}
