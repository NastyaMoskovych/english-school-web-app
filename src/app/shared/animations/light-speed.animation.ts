import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const lightSpeedAnimation = trigger('lightSpeedAnimation', [
  transition(':enter', [
    animate(
      '500ms',
      keyframes([
        style({
          visibility: 'visible',
          opacity: 0,
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          easing: 'ease-out',
          offset: 0,
        }),
        style({
          opacity: 1,
          transform: 'skewX(20deg)',
          easing: 'ease-out',
          offset: 0.6,
        }),
        style({
          opacity: 1,
          transform: 'skewX(-5deg)',
          easing: 'ease-out',
          offset: 0.8,
        }),
        style({
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
          easing: 'ease-out',
          offset: 1,
        }),
      ]),
    ),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate(
      '500ms',
      keyframes([
        style({ opacity: 1, easing: 'ease-in', offset: 0 }),
        style({
          opacity: 0,
          transform: 'translate3d(100%, 0, 0) skewX(30deg)',
          easing: 'ease-in',
          offset: 1,
        }),
      ]),
    ),
  ]),
]);
