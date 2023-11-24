import { Pipe, PipeTransform } from '@angular/core';
import { User } from '@angular/fire/auth';

@Pipe({
  name: 'photoUrl',
  standalone: true,
})
export class PhotoUrlPipe implements PipeTransform {
  transform(user: User): string {
    const { displayName, photoURL } = user;

    if (photoURL) {
      return photoURL.replaceAll('s96-c', 's256-c');
    }

    return `https://ui-avatars.com/api/?name=${displayName}&size=128&bold=true`;
  }
}
