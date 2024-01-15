import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DropdownComponent,
  DropdownOption,
  LoaderComponent,
  PageLayoutComponent,
} from '@shared/components';
import { IUser } from '@shared/models';
import { DropdownOptionsPipe, PhotoUrlPipe } from '@shared/pipes';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageLayoutComponent,
    PhotoUrlPipe,
    NgOptimizedImage,
    LoaderComponent,
    DropdownComponent,
    DropdownOptionsPipe,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  users$: Observable<IUser[]>;
  selectedRole$ = new BehaviorSubject<DropdownOption | undefined>(undefined);

  ngOnInit(): void {
    this.users$ = combineLatest([
      this.usersService.getAllUsers(),
      this.selectedRole$,
    ]).pipe(
      map(([users, selectedRole]) =>
        this.getFilteredUsers(users, selectedRole),
      ),
    );
  }

  onRoleSelect(role: DropdownOption): void {
    this.selectedRole$.next(role);
  }

  private getFilteredUsers(
    users: IUser[],
    selectedRole?: DropdownOption,
  ): IUser[] {
    return users.filter((user: IUser) => {
      if (selectedRole?.value === 'admins') {
        return Boolean(user.isAdmin);
      }

      if (selectedRole?.value === 'users') {
        return !user.isAdmin;
      }

      return true;
    });
  }
}
