import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstName',
  standalone: true
})
export class FirstNamePipe implements PipeTransform {

  transform(value: string | null): string {
    if (value) {
      return value.split(' ')[0];
    }

    return '';
  }
}
