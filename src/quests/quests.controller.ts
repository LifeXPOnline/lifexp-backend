import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AvailableQuestsService } from './availableQuests.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreateAvailableQuestDto } from './dto/createAvailableQuest.dto';

@Controller('quests')
export class QuestsController {
  constructor(
    private availableQuestsService: AvailableQuestsService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('available')
  async createEntry(@Request() req: any, @Body() body: CreateAvailableQuestDto) {
    return await this.availableQuestsService.createAvailableQuest(req.user?.email, body);
  }
}
