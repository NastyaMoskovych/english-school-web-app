import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthError } from '@angular/fire/auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthErrorPipe } from '@shared/pipes';
import { SignInProviders } from '../../../services/auth.service';
import { FormFieldComponent } from '../form-field/form-field.component';
import { NotificationComponent } from '../notification/notification.component';

export enum AuthType {
  Login = 'login',
  Signup = 'signup',
}

export interface AuthForm {
  displayName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    NotificationComponent,
    TranslateModule,
    AuthErrorPipe,
  ],
})
export class AuthFormComponent implements OnInit {
  @Input({ required: true }) authType: AuthType;
  @Input() loading: boolean | null;
  @Input() error: AuthError | null;
  @Output() signInWithProvider = new EventEmitter<SignInProviders>();
  @Output() formSubmit = new EventEmitter<AuthForm>();

  private destroy = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);

  signInProviders = SignInProviders;
  form: FormGroup;

  get isSignUp(): boolean {
    return this.authType === AuthType.Signup;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      displayName: [
        '',
        this.isSignUp ? [Validators.required, Validators.minLength(4)] : [],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe(() => {
        if (this.error) {
          this.error = null;
        }
      });
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.formSubmit.emit(this.form.value as AuthForm);
    }
  }
}
