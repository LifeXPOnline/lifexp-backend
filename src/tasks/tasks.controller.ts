import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { TaskCategory } from './schemas/task.schema';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@Request() req: any, @Body() body: CreateTaskDto) {
    return this.tasksService.createTask(req.user?.email, body);
  }

  @Get()
  async getTasks(
    @Request() req: any,
    @Query('category') category?: TaskCategory,
  ) {
    return this.tasksService.getTasks(req.user?.email, category);
  }

  @Get(':id')
  async getTaskById(@Request() req: any, @Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);

    if (!task)
      throw new HttpException(
        `Task with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );

    if (task.get('createdBy.email') !== req.user?.email)
      throw new HttpException(
        `Task with id ${id} is not accessible`,
        HttpStatus.FORBIDDEN,
      );

    return task;
  }

  @Patch(':id')
  async updateTaskById(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updatedTaskDto: Partial<CreateTaskDto>,
  ) {
    const task = await this.tasksService.getTaskById(id);
    if (!task) return;

    if (task.get('createdBy.email') !== req.user?.email) {
      throw new HttpException(
        `Entry with id ${id} is not accessible`,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.tasksService.updateTaskById(id, updatedTaskDto);
  }

  @Delete(':id')
  async deleteTask(@Request() req: any, @Param('id') id: string) {
    const task = await this.tasksService.getTaskById(id);
    if (!task) return;

    if (task.get('createdBy.email') !== req.user?.email) {
      throw new HttpException(
        `Entry with id ${id} is not accessible`,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.tasksService.deleteTask(id);
  }
}
