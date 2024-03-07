import { TaskCategory, TaskDifficulty } from '../schemas/task.schema';

export class CreateTaskDto {
  readonly title: string;
  readonly category: TaskCategory;
  readonly difficulty: TaskDifficulty;
}
