import { Module } from '@nestjs/common';
import { QuestsController } from './quests.controller';
import { AvailableQuestsService } from './availableQuests.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AvailableQuest, AvailableQuestSchema } from './schemas/availableQuest.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: AvailableQuest.name, schema: AvailableQuestSchema }]),
  ],
  controllers: [QuestsController],
  providers: [AvailableQuestsService],
})
export class QuestsModule {}
