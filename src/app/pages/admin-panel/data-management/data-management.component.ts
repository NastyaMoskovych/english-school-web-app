import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [],
  templateUrl: './data-management.component.html',
  styleUrl: './data-management.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataManagementComponent {}
