import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User, UserSchema } from '../../users/schemas/user.schema';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
export enum TaskCategory {
  FITNESS = 'fitness',
  WORK = 'work',
  PERSONAL = 'personal',
}

export enum TaskDifficulty {
  TRIVIAL = 'trivial',
  EASY = 'easy',
  AVERAGE = 'average',
  HARD = 'hard',
  CHALLENGE = 'challenge',
}

export const TaskPoints = {
  trivial: 5,
  easy: 15,
  average: 30,
  hard: 50,
  challenge: 100,
};

@Schema({
  timestamps: true,
})
export class Task {
  @Prop({
    index: true,
    enum: [TaskCategory.FITNESS, TaskCategory.WORK, TaskCategory.PERSONAL],
  })
  category: string;

  @Prop()
  title: string;

  @Prop({
    enum: [
      TaskDifficulty.TRIVIAL,
      TaskDifficulty.EASY,
      TaskDifficulty.AVERAGE,
      TaskDifficulty.HARD,
      TaskDifficulty.CHALLENGE,
    ],
  })
  difficulty: string;

  @Prop({
    type: UserSchema.omit(['password']),
    required: true,
  })
  createdBy: User;

  @Prop()
  isComplete: boolean;

  @Prop()
  points: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
