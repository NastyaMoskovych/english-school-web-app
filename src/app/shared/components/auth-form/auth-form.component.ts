import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthError } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInProviders } from '../../../services/auth.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent implements OnInit {
  @Input({ required: true }) authType: AuthType;
  @Input() loading: boolean | null;
  @Input() error: AuthError | null;
  @Output() signInWithProvider = new EventEmitter<SignInProviders>();
  @Output() formSubmit = new EventEmitter<AuthForm>();

  private formBuilder = inject(FormBuilder);
  private destroy = inject(DestroyRef);

  signInProviders = SignInProviders;
  form: FormGroup;

  get isSignUp(): boolean {
    return this.authType === AuthType.Signup;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      displayName: ['', this.isSignUp ? [Validators.required, Validators.minLength(4)] : []],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroy),
    ).subscribe(() => {
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
