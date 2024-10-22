import {
  Body,
  Controller,
  Param,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from './user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put('/:uid')
  updateUser(
    @Param('uid') uid: string,
    @Body() payload: UserDto,
    @Query('sessionId') sessionId: string,
  ): Promise<void> {
    return this.userService.updateUser(payload, uid, sessionId);
  }
}
