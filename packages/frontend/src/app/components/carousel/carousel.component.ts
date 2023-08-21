import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Image} from '../../models/rest/strapi-components.model';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe],
})
export class CarouselComponent {
  CMS_URL = environment.CMS_URL;

  selectedIndex$ = new BehaviorSubject<number>(0);

  get selectedIndexValue() {
    return this.selectedIndex$.getValue();
  }

  @Input()
  images: Image[] = [];

  prevClick() {
    if (this.selectedIndexValue === 0) {
      this.selectedIndex$.next(this.images.length - 1);
    } else {
      this.selectedIndex$.next(this.selectedIndexValue - 1);
    }
  }

  nextClick() {
    if (this.selectedIndexValue === this.images.length - 1) {
      this.selectedIndex$.next(0);
    } else {
      this.selectedIndex$.next(this.selectedIndexValue + 1);
    }
  }
}
