import {Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards} from '@nestjs/common';
import {JwtGuard} from 'src/auth/jwt.guard';
import {JournalService} from './journal.service';
import {CreateEntryDto} from './dto/create-entry.dto';
import {EntryMood} from './schemas/entry.schema';
import {QueryOptions} from 'src/common/interfaces';

@Controller('api/journal')
export class JournalController {
    constructor(
        private journalService: JournalService,
    ) {}

    @UseGuards(JwtGuard)
    @Post('entries')
    async createEntry(@Request() req: any, @Body() body: CreateEntryDto) {
        return await this.journalService.createEntry(req.user?.email, body);
    }

    @UseGuards(JwtGuard)
    @Get('entries/:id')
    async getEntry(@Request() req: any, @Param() {id}: {id: string}) {
        const entry = await this.journalService.getEntryById(id);
        if (!entry)
            throw new HttpException(`Entry with id ${id} does not exist`, HttpStatus.NOT_FOUND);
        if (entry.get('createdBy.email') !== req.user?.email)
            throw new HttpException(`Entry with id ${id} is not accessible`, HttpStatus.FORBIDDEN);
        return entry;
    }

    @UseGuards(JwtGuard)
    @Patch('entries/:id')
    async patchEntry(@Request() req: any, @Param() {id}: {id: string}, @Body() body: Partial<CreateEntryDto>) {
        // Make sure user can get entry
        await this.getEntry(req, {id});
        return await this.journalService.updateEntryById(id, body);
    }

    @UseGuards(JwtGuard)
    @Delete('entries/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteEntry(@Request() req: any, @Param() {id}: {id: string}) {
        const entry = await this.journalService.getEntryById(id);
        if (!entry)
            return;
        if (entry.get('createdBy.email') !== req.user?.email)
            throw new HttpException(`Entry with id ${id} is not accessible`, HttpStatus.FORBIDDEN);
        await this.journalService.removeEntryById(id);
        return;
    }

    @UseGuards(JwtGuard)
    @Get('entries')
    async getEntries(
        @Request() req: any,
        @Query('search') searchText?: string,
        @Query('mood') mood?: EntryMood,
        @Query('sort', new DefaultValuePipe('+updatedAt')) sort?: string,
        @Query('limit', new DefaultValuePipe(20), new ParseIntPipe()) limit?: number,
        @Query('skip', new DefaultValuePipe(0), new ParseIntPipe()) skip?: number
    ) {
        console.log(sort)
        const entries = await this.journalService.getEntries(
            req.user.email,
            searchText,
            mood,
            new QueryOptions(sort, limit, skip),
        );
        return entries;
    }
}
