import { Pipe, PipeTransform } from '@angular/core';
import { AuthError, AuthErrorCodes } from '@angular/fire/auth';

@Pipe({
  name: 'authError'
})
export class AuthErrorPipe implements PipeTransform {

  transform(error: AuthError): string {
    return errorMessagesMap[error.code] || 'general.errors.generalError';
  }
}

const errorMessagesMap: { [key: string]: string } = {
  'auth/invalid-login-credentials': 'general.errors.invalidLoginCredentials',
  'auth/email-already-in-use': 'general.errors.emailAlreadyInUse',
  [AuthErrorCodes.UNVERIFIED_EMAIL]: 'general.errors.unverifiedEmail',
};
