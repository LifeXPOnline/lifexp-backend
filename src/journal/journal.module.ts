import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { UsersModule } from 'src/users/users.module';
import { Entry, EntrySchema } from './schemas/entry.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
