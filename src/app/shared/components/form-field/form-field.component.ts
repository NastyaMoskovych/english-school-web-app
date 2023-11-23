import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ControlContainer, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class FormFieldComponent implements OnInit {
  @Input({ required: true }) controlName: string;
  @Input({ required: true }) label: string;
  @Input() errorMessages: { [key: string]: string };
  @Input() disabled = false;
  @Input() type = 'text';

  private controlContainer = inject(ControlContainer);
  public formControl: FormControl;
  public isPasswordVisible = false;

  get errorMesage(): string {
    const errors = this.formControl.errors;

    if (!errors) {
      return '';
    }

    return this.errorMessages[Object.keys(errors)[0]];
  }

  ngOnInit(): void {
    this.formControl = this.controlContainer.control?.get(this.controlName) as FormControl;

    if (this.disabled) {
      this.formControl.disable();
    }
  }
}
