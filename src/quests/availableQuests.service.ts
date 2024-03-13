import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Error, Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { AvailableQuest } from './schemas/availableQuest.schema';
import { CreateAvailableQuestDto } from './dto/createAvailableQuest.dto';

@Injectable()
export class AvailableQuestsService {
  constructor(
    @InjectModel(AvailableQuest.name) private readonly availableQuestModel: Model<AvailableQuest>,
    private readonly userService: UsersService,
  ) {}

  async createAvailableQuest(email: string, availableQuest: CreateAvailableQuestDto) {
    const createdBy = await this.userService.getByEmail(email);
    if (!createdBy)
      throw new HttpException(`User ${email} does not exist`, HttpStatus.BAD_REQUEST);
    try {
      return await this.availableQuestModel.create({
        ...availableQuest,
        createdBy,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof Error.ValidationError)
        throw new HttpException(`Invalid quest`, HttpStatus.BAD_REQUEST);
      else
        throw new HttpException(`Could not create quest`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
