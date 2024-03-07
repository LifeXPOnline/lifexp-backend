import { EntryMood } from '../schemas/entry.schema';

export class CreateEntryDto {
  readonly title: string;
  readonly content: string;
  readonly mood: EntryMood;
}
