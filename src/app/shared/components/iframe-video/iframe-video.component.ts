import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SanitizePipe } from '../../pipes';

@Component({
  selector: 'app-iframe-video',
  standalone: true,
  imports: [SanitizePipe],
  templateUrl: './iframe-video.component.html',
  styleUrl: './iframe-video.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IframeVideoComponent {
  @Input({ required: true }) videoURL: string;
}
