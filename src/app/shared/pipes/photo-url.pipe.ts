import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../../models/user.model';

@Pipe({
  name: 'photoUrl'
})
export class PhotoUrlPipe implements PipeTransform {

  transform(user: IUser): string {
    const { displayName, photoURL } = user;

    if (photoURL) {
      return photoURL;
    }

    return `https://ui-avatars.com/api/?name=${displayName}&size=128&bold=true`;
  }
}
