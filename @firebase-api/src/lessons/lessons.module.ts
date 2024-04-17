import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserModule } from '../user/user.module';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';

@Module({
  imports: [FirebaseModule, UserModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
