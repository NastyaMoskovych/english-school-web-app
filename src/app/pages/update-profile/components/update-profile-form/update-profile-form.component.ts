import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from '../../../../models/user.model';
import { toBase64 } from '../../../../shared/utils';

export interface IUpdateProfilePayload extends IUser {
  file: File;
}

@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrls: ['./update-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateProfileFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) user: IUser;
  @Input({ required: true }) loading: boolean;
  @Output() submitEvent = new EventEmitter<IUpdateProfilePayload>();

  private formBuilder = inject(FormBuilder);
  private file: File | null;

  imagePreview = signal<string | ArrayBuffer | null>(null);
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      displayName: [this.user.displayName, [Validators.required, Validators.minLength(4)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      file: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && !changes['loading'].currentValue) {
      this.imagePreview.set(null);
      this.file = null;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitEvent.emit({
        ...this.form.value,
        uid: this.user.uid,
        file: this.file,
      });
    }
  }

  onPreviewRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.imagePreview.set(null);
  }

  async onImageUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file && file.type.includes('image')) {
      this.form.patchValue({ file });
      this.imagePreview.set(await toBase64(file));
      this.file = file;
    }
  }
}
