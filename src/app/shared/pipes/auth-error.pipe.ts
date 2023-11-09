import { Pipe, PipeTransform } from '@angular/core';
import { AuthError } from '@angular/fire/auth';

@Pipe({
  name: 'authError'
})
export class AuthErrorPipe implements PipeTransform {

  transform(error: AuthError): string {
    return errorMessagesMap[error.code] || 'authForm.errors.generalError';
  }
}

const errorMessagesMap: { [key: string]: string } = {
  'auth/invalid-login-credentials': 'authForm.errors.invalidLoginCredentials',
  'auth/email-already-in-use': 'authForm.errors.emailAlreadyInUse',
};
