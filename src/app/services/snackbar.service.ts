import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum SnackbarMessages {
  REGISTER_SUCCESS = 'general.messages.registerSuccess',
  UPDATE_PROFILE_SUCCESS = 'general.messages.updateProfileSuccess',
  CHANGE_PASSWORD_SUCCESS = 'general.messages.changePasswordSuccess',
  UPDATE_SUCCESS = 'general.messages.updateSuccess',
  SUBMIT_QUIZ_FAILED = 'general.messages.userAlreadyPassedQuiz',
}

export interface ISnackbarPayload {
  message: SnackbarMessages;
  type?: 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  message$ = new BehaviorSubject<ISnackbarPayload | null>(null);

  show(payload: ISnackbarPayload): void {
    this.message$.next({
      ...payload,
      type: payload.type || 'success',
    });
  }

  hide(): void {
    this.message$.next(null);
  }
}
