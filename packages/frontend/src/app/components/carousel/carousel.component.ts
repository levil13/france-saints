import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {Image} from '../../models/rest/strapi-components.model';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition(':enter', [style({opacity: 0}), animate(250, style({opacity: 1}))]),
      transition(':leave', [animate(250, style({opacity: 0}))]),
    ]),
  ],
})
export class CarouselComponent {
  private _selectedIndex = 0;

  get selectedIndex(): number {
    return this._selectedIndex;
  }

  set selectedIndex(value: number) {
    this._selectedIndex = value;
    this.cdr.markForCheck();
  }

  @Input()
  images: Image[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  prevClick() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.images.length - 1;
    } else {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  nextClick() {
    if (this.selectedIndex === this.images.length - 1) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
}
