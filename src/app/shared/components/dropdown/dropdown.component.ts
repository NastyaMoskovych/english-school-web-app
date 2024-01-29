import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { slideAnimation } from '@shared/animations';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideAnimation],
})
export class DropdownComponent {
  @Input({ required: true }) options: DropdownOption[];
  @Input() placeholder: string;
  @Input() selectedOption: DropdownOption | null;
  @Input() backgroundColor = 'inherit';
  @Output() selectEvent = new EventEmitter<DropdownOption>();

  opened = false;
  searchTerm = '';

  get filteredOptions(): DropdownOption[] {
    return this.options.filter(({ label }) =>
      label.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  toggleDropdown(state: boolean, event?: MouseEvent): void {
    this.opened = state;

    if (!state) {
      this.searchTerm = '';
    }

    if (event) {
      event.preventDefault();
    }
  }

  onFocusOut(event: FocusEvent, ref: HTMLElement): void {
    if (!ref.contains(event.relatedTarget as HTMLElement)) {
      this.toggleDropdown(false);
    }
  }

  onSelect(option: DropdownOption): void {
    this.selectedOption = option;
    this.selectEvent.emit(option);
    this.toggleDropdown(false);
  }
}
