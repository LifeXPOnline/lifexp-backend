import { LocalDate } from '@js-joda/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';

export type EntryDocument = HydratedDocument<Entry>;
export enum EntryMood {
  DEPRESSED = 'depressed',
  VERY_SAD = 'verySad',
  SAD = 'sad',
  ANGRY = 'angry',
  OK = 'ok',
  HAPPY = 'happy',
}

@Schema({
  timestamps: true,
})
export class Entry {
  @Prop({
    default: `Entry of ${getTodayFormatted()}`,
  })
  title: string;

  @Prop({
    default: '',
  })
  content: string;

  @Prop({
    index: true,
    enum: [
      EntryMood.DEPRESSED,
      EntryMood.VERY_SAD,
      EntryMood.SAD,
      EntryMood.ANGRY,
      EntryMood.OK,
      EntryMood.HAPPY,
    ],
  })
  mood: string;

  @Prop({
    type: UserSchema.omit(['password']),
    required: true,
  })
  createdBy: User;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);

/* TODO: move this in EntryService because we might want
to check user preferences for date formats first */
function getTodayFormatted() {
  const n = LocalDate.now();
  return `${n.dayOfMonth()} ${n.month().toString()} ${n.year()}`;
}
