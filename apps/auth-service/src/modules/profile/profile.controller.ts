import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get('me')
  me(@Req() req: any) { return this.profile.me(req.user.id); }

  @Put('storefront')
  updateStorefront(@Req() req: any, @Body() body: { storefrontColor?: string; storefrontBannerUrl?: string; storefrontSlogan?: string; }) {
    return this.profile.updateStorefront(req.user.id, body);
  }
}
