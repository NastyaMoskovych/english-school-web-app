import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserModule } from '../user/user.module';
import { LessonsProgressService } from './lessons-progress.service';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [LessonsController],
  providers: [LessonsService, LessonsProgressService],
  exports: [LessonsService, LessonsProgressService],
})
export class LessonsModule {}
