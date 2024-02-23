import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { JournalService } from './journal.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createEntry(@Request() req: any, @Body() body: CreateEntryDto) {
    return await this.journalService.createEntry(req.user?.username, body);
  }
}
