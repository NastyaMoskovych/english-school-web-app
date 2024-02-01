import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { slideAnimation } from '@shared/animations';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  animations: [slideAnimation],
})
export class DropdownComponent implements OnInit {
  @Input({ required: true }) options: DropdownOption[];
  @Input() controlName: string;
  @Input() placeholder: string;
  @Input() selectedOption: DropdownOption | null;
  @Input() backgroundColor = 'inherit';
  @Input() errorMessages: { [key: string]: string };
  @Output() selectEvent = new EventEmitter<DropdownOption>();
  @ViewChild('input') inputRef: ElementRef<HTMLInputElement>;

  formControl: FormControl;
  opened = false;
  searchTerm = '';

  get filteredOptions(): DropdownOption[] {
    return this.options.filter(({ label }) =>
      label.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  get errorMesage(): string {
    const errors = this.formControl.errors;

    if (!errors) {
      return '';
    }

    return this.errorMessages[Object.keys(errors)[0]];
  }

  constructor(@Optional() private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    if (this.controlName && this.controlContainer) {
      this.formControl = this.controlContainer.control?.get(
        this.controlName,
      ) as FormControl;
    } else {
      this.formControl = new FormControl();
    }
  }

  toggleDropdown(state: boolean, event?: MouseEvent): void {
    this.opened = state;
    this.searchTerm = '';

    if (!state) {
      this.formControl.setValue(this.selectedOption?.value || '');
      this.inputRef.nativeElement.value = this.selectedOption?.label || '';
    } else {
      this.inputRef.nativeElement.value = '';
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
