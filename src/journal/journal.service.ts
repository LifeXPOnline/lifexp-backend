import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Entry } from './schemas/entry.schema';
import { Error, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(Entry.name) private readonly entryModel: Model<Entry>,
    private readonly userService: UsersService,
  ) {}

  async createEntry(username: string, journalEntry: CreateEntryDto) {
    const createdBy = await this.userService.getByUsername(username);
    if (!createdBy)
      throw new HttpException(`User ${username} does not exist`, HttpStatus.BAD_REQUEST);
    try {
      return await this.entryModel.create({
        ...journalEntry,
        createdBy,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error.ValidationError)
        throw new HttpException(`Invalid entry`, HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(`Could not create entry`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
