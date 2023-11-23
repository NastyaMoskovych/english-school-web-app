import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthError } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldComponent, NotificationComponent } from '@shared/components';
import { AuthErrorPipe } from '@shared/pipes';

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    NotificationComponent,
    TranslateModule,
    AuthErrorPipe,
  ]
})
export class ChangePasswordFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) loading: boolean;
  @Input() error: AuthError | null;
  @Output() submitEvent = new EventEmitter<IChangePasswordPayload>();

  private destroy = inject(DestroyRef);

  form = inject(FormBuilder).group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(
      takeUntilDestroyed(this.destroy),
    ).subscribe(() => {
      if (this.error) {
        this.error = null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && !changes['loading'].currentValue) {
      this.form.reset({ currentPassword: '', newPassword: '' }, { emitEvent: false });
      this.form.markAsUntouched();
      this.form.updateValueAndValidity({ emitEvent: false });
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.submitEvent.emit(this.form.value as IChangePasswordPayload);
    }
  }
}
