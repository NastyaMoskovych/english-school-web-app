import { Module } from '@nestjs/common';
import { FirebaseModule } from '../firebase/firebase.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
