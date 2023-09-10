import {animate, query, style, transition, trigger} from '@angular/animations';

export const fade = trigger('fade', [
  transition(':enter', [style({opacity: 0}), animate(250, style({opacity: 1}))]),
  transition(':leave', [animate(250, style({opacity: 0}))]),
]);

export const slideInOutLeft = trigger('slideInOutLeft', [
  transition(':enter', [style({marginLeft: '-350px'}), animate('500ms ease-in-out', style({marginLeft: '0'}))]),
  transition(':leave', [animate('500ms ease-in-out', style({marginLeft: '-350px'}))]),
]);

export const slideInOutRight = trigger('slideInOutRight', [
  transition(':enter', [style({marginRight: '-482px'}), animate('500ms ease-in-out', style({marginRight: '0'}))]),
  transition(':leave', [animate('500ms ease-in-out', style({marginRight: '-482px'}))]),
]);

export const fadeRoute = trigger('fadeRoute', [
  transition('* => *', [
    query(
      ':enter',
      [style({opacity: 0, position: 'absolute', height: '100%', width: '100%'})],
      {optional: true}
    ),
    query(
      ':leave',
      [style({opacity: 1, position: 'absolute', height: '100%', width: '100%'}), animate('100ms', style({opacity: 0}))],
      {optional: true}
    ),
    query(
      ':enter',
      [style({opacity: 0, position: 'relative', height: '100%', width: '100%'}), animate('100ms', style({opacity: 1}))],
      {optional: true}
    ),
  ]),
]);
