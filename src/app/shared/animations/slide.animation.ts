import { animate, style, transition, trigger } from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  transition(':enter', [
    style({ height: 0 }),
    animate('0.2s', style({ height: '*' })),
  ]),
  transition(':leave', [
    style({ height: '*' }),
    animate('0.2s', style({ height: 0 })),
  ]),
]);
