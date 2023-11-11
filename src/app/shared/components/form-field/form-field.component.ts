import { Component, Input, OnInit, inject } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit {
  @Input({ required: true }) controlName: string;
  @Input({ required: true }) label: string;
  @Input() errorMessages: { [key: string]: string };
  @Input() type = 'text';

  private controlContainer = inject(ControlContainer);
  public formControl: FormControl;

  get errorMesage(): string {
    const errors = this.formControl.errors;

    if (!errors) {
      return '';
    }

    return this.errorMessages[Object.keys(errors)[0]];
  }

  ngOnInit(): void {
    this.formControl = this.controlContainer.control?.get(this.controlName) as FormControl;
  }
}
