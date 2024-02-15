import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { LoaderComponent } from '@shared/components';
import { NgxImageCompressService } from 'ngx-image-compress';

export interface UploadImageEvent {
  imageURL: string;
  doneCb: () => void;
}

@Component({
  selector: 'app-lesson-image',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './lesson-image.component.html',
  styleUrl: './lesson-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonImageComponent {
  @Input({ required: true }) imageURL: string | undefined;
  @Output() uploadImageEvent = new EventEmitter<UploadImageEvent>();

  private imageCompress = inject(NgxImageCompressService);
  loading = signal<boolean>(false);

  stopLoading(): void {
    this.loading.set(false);
  }

  uploadImage(): void {
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      this.loading.set(true);
      this.imageCompress
        .compressFile(image, orientation)
        .then((compressedImage) => {
          if (compressedImage) {
            this.uploadImageEvent.emit({
              imageURL: compressedImage,
              doneCb: this.stopLoading.bind(this),
            });
          }
        });
    });
  }
}
