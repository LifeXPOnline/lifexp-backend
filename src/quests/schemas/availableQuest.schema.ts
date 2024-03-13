import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';

export type AvailableQuestDocument = HydratedDocument<AvailableQuest>;
export enum QuestDifficulty {
  EASY,
  AVERAGE,
  HARD,
  VERY_HARD,
  IMPOSSIBLE
}
export enum QuestRecurrence {
  ONE_TIME = 'oneTime',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}
export enum QuestStatus {
  AVAILABLE = 'available',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}
export enum QuestSkill {
  FITNESS = 'fitness',
  HEALTH = 'health',
  LEARNING = 'learning',
  MENTAL_HEALTH = 'mentalHealth',
  SELF_CARE = 'selfCare',
  CREATIVITY = 'creativity',
  SOCIAL = 'social',
  WORK = 'work'
}

@Schema({
  timestamps: true,
})
export class AvailableQuest {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    default: 50,
  })
  xp: number;

  @Prop({
    default: 10,
  })
  coins: number;

  @Prop({
    index: true,
    enum: [
      QuestDifficulty.EASY,
      QuestDifficulty.AVERAGE,
      QuestDifficulty.HARD,
      QuestDifficulty.VERY_HARD,
      QuestDifficulty.IMPOSSIBLE,
    ]
  })
  difficulty: QuestDifficulty;

  @Prop({
    enum: [
      QuestRecurrence.ONE_TIME,
      QuestRecurrence.DAILY,
      QuestRecurrence.WEEKLY,
      QuestRecurrence.MONTHLY,
      QuestRecurrence.YEARLY
    ]
  })
  recurrence: QuestRecurrence;

  @Prop({
    enum: [
      QuestSkill.FITNESS,
      QuestSkill.HEALTH,
      QuestSkill.LEARNING,
      QuestSkill.MENTAL_HEALTH,
      QuestSkill.SELF_CARE,
      QuestSkill.CREATIVITY,
      QuestSkill.SOCIAL,
      QuestSkill.WORK
    ]
  })
  skill: QuestSkill;

  @Prop({
    enum: [
      QuestStatus.AVAILABLE,
      QuestStatus.EXPIRED
    ],
    default: QuestStatus.AVAILABLE
  })
  status: QuestStatus;

  @Prop({
    default: new Date(),
  })
  expiresAt: Date;

  @Prop({
    type: UserSchema.omit(['password']),
    required: true,
  })
  createdBy: Omit<User, 'password'>;
}

export const AvailableQuestSchema = SchemaFactory.createForClass(AvailableQuest);

