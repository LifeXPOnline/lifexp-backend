import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskCategory, TaskPoints } from './schemas/task.schema';
import { Error, FilterQuery, Model } from 'mongoose';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly userService: UsersService,
  ) {}
  async createTask(email: string, createTaskDto: CreateTaskDto) {
    const createdBy = await this.userService.getByEmail(email);
    if (!createdBy) {
      throw new HttpException(
        `User ${email} does not exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.taskModel.create({
        ...createTaskDto,
        createdBy,
        isComplete: false,
        points: TaskPoints[createTaskDto.difficulty],
      });
    } catch (e) {
      console.error(e);

      if (e instanceof Error.ValidationError) {
        throw new HttpException(`Invalid entry`, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(
          `Could not create task`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getTasks(email: string, category?: TaskCategory) {
    const query: FilterQuery<Task> = category ? { category } : {};

    return this.taskModel.find({
      ...query,
      'createdBy.email': email,
    });
  }

  async getTaskById(id: string) {
    return this.taskModel.findById(id);
  }

  async updateTaskById(id: string, updatedTaskDto: Partial<CreateTaskDto>) {
    await this.taskModel.updateOne({ _id: id }, updatedTaskDto);

    return this.getTaskById(id);
  }

  async deleteTask(id: string) {
    return this.taskModel.deleteOne({ _id: id });
  }
}
