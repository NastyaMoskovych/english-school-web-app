import { IsOptional } from 'class-validator';
import { EnglishLevel } from '../shared/models';

export class UserDto {
  @IsOptional()
  displayName: string;

  @IsOptional()
  email: string;

  @IsOptional()
  photoURL: string;

  @IsOptional()
  uid: string;
}

export interface IUser {
  displayName: string;
  email: string;
  level: EnglishLevel;
  photoURL: string;
  uid: string;
}
