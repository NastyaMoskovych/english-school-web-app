import { Injectable } from '@angular/core';
import { DropdownOption } from '@shared/components';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LessonsManagementService {
  selectedLevel$ = new BehaviorSubject<DropdownOption | undefined>(undefined);
}
