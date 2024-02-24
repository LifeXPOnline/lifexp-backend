import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/jwt.guard';
import { JournalService } from './journal.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { Entry } from './schemas/entry.schema';

@Controller('journal')
export class JournalController {
  constructor(
    private journalService: JournalService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('entries')
  async createEntry(@Request() req: any, @Body() body: CreateEntryDto) {
    return await this.journalService.createEntry(req.user?.username, body);
  }

  @UseGuards(JwtGuard)
  @Get('entries/:id')
  async getEntry(@Request() req: any, @Param() {id}) {
    const entry = await this.journalService.getEntryById(id);
    if (!entry)
      throw new HttpException(`Entry with id ${id} does not exist`, HttpStatus.NOT_FOUND);
    if (entry.get('createdBy.username') !== req.user?.username)
      throw new HttpException(`Entry with id ${id} is not accessible`, HttpStatus.FORBIDDEN);
    return entry;
  }
}
