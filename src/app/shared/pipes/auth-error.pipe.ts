import { Pipe, PipeTransform } from '@angular/core';
import { AuthError, AuthErrorCodes } from '@angular/fire/auth';

@Pipe({
  name: 'authError',
  standalone: true,
})
export class AuthErrorPipe implements PipeTransform {
  transform(error: AuthError): string {
    return errorMessagesMap[error.code] || 'general.errors.generalError';
  }
}

const errorMessagesMap: { [key: string]: string } = {
  [AuthErrorCodes.INVALID_LOGIN_CREDENTIALS]:
    'general.errors.invalidLoginCredentials',
  [AuthErrorCodes.EMAIL_EXISTS]: 'general.errors.emailAlreadyInUse',
  [AuthErrorCodes.UNVERIFIED_EMAIL]: 'general.errors.unverifiedEmail',
};
