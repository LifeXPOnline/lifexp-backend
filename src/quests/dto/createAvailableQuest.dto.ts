import { QuestDifficulty, QuestRecurrence, QuestSkill } from "../schemas/availableQuest.schema";

export class CreateAvailableQuestDto {
    readonly title: string;
    readonly xp: number;
    readonly coins: number;
    readonly difficulty: QuestDifficulty;
    readonly recurrence: QuestRecurrence;
    readonly skill: QuestSkill;
    readonly expiresAt: Date;
}
