import { animate, style, transition, trigger } from '@angular/animations';

export const transformAnimation = trigger('transformAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translate(-50%, 100%)' }),
    animate(
      '0.3s ease-out',
      style({ opacity: 1, transform: 'translate(-50%, -50%)' }),
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translate(-50%, -50%)' }),
    animate(
      '0.3s ease-out',
      style({ opacity: 0, transform: 'translate(-50%, 100%)' }),
    ),
  ]),
]);
