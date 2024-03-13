import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { QuestDifficulty, QuestRecurrence, QuestSkill, QuestStatus } from './availableQuest.schema';

export type UserQuestDocument = HydratedDocument<UserQuest>;

@Schema({
  timestamps: true,
})
export class UserQuest {
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
      QuestSkill.SOCIAL
    ]
  })
  skill: QuestSkill;

  @Prop({
    enum: [
      QuestStatus.AVAILABLE,
      QuestStatus.IN_PROGRESS,
      QuestStatus.COMPLETED,
      QuestStatus.CANCELLED,
      QuestStatus.EXPIRED
    ],
    default: QuestStatus.AVAILABLE
  })
  status: QuestStatus;

  @Prop({
    type: UserSchema.omit(['password']),
    required: true,
  })
  createdBy: Omit<User, 'password'>;
}

export const UserQuestSchema = SchemaFactory.createForClass(UserQuest);

