import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldComponent } from '@shared/components';
import { PhotoUrlPipe } from '@shared/pipes';
import { NgxImageCompressService } from 'ngx-image-compress';

export interface IUpdateProfilePayload extends User {
  imageData: string;
}

@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrls: ['./update-profile-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent,
    TranslateModule,
    PhotoUrlPipe,
  ],
})
export class UpdateProfileFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) user: User;
  @Input({ required: true }) loading: boolean;
  @Output() submitEvent = new EventEmitter<IUpdateProfilePayload>();

  private formBuilder = inject(FormBuilder);
  private imageCompress = inject(NgxImageCompressService);
  private imageData: string | null;

  imagePreview = signal<string | ArrayBuffer | null>(null);
  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      displayName: [
        this.user.displayName,
        [Validators.required, Validators.minLength(4)],
      ],
      email: [this.user.email, [Validators.required, Validators.email]],
      imageData: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading'] && !changes['loading'].currentValue) {
      this.imagePreview.set(null);
      this.imageData = null;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitEvent.emit({
        ...this.form.value,
        uid: this.user.uid,
        imageData: this.imageData,
      });
    }
  }

  onPreviewRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.imagePreview.set(null);
  }

  onImageUpload(): void {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.imageCompress
        .compressFile(image, orientation)
        .then((compressedImage) => {
          if (compressedImage) {
            this.imagePreview.set(compressedImage);
            this.imageData = compressedImage;
          }
        });
    });
  }
}
