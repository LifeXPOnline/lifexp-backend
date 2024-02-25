import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEntryDto } from './dto/create-entry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Entry, EntryMood } from './schemas/entry.schema';
import { Error, FilterQuery, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { QueryOptions } from 'src/common/interfaces';

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

  async getEntryById(id: string) {
    return await this.entryModel.findById(id);
  }

  async updateEntryById(id: string, changes: Partial<CreateEntryDto>) {
    await this.entryModel.updateOne({_id: id}, changes);
    return await this.getEntryById(id);
  }

  async removeEntryById(id: string) {
    return await this.entryModel.deleteOne({_id: id});
  }

  async getEntries(username: string, searchText?: string, mood?: EntryMood, queryOptions?: QueryOptions) {
    const query: FilterQuery<Entry> = searchText ? {
      $or: [
        {title: {$regex: searchText, $options: 'i'}},
        {content: {$regex: searchText, $options: 'i'}},
      ]
    } : {};
    if (mood) {
      query.mood = mood;
    }
    queryOptions = queryOptions ?? new QueryOptions();

    return await this.entryModel.find({
      ...query,
      'createdBy.username': username,
    }).sort(queryOptions.sort)
      .limit(queryOptions.limit)
      .skip(queryOptions.skip);
  }
}
