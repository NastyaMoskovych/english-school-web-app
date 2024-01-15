import { Pipe, PipeTransform } from '@angular/core';
import { DropdownOption } from '../components';

@Pipe({
  name: 'dropdownOptions',
  standalone: true,
})
export class DropdownOptionsPipe implements PipeTransform {
  transform(value: object): DropdownOption[] {
    return Object.entries(value).map(([value, label]) => ({ value, label }));
  }
}
