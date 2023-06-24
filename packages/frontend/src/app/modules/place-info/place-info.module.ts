import {NgModule} from '@angular/core';
import {PlaceInfoComponent} from '../../components/place-info/place-info.component';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [PlaceInfoComponent, CarouselComponent],
  imports: [CommonModule],
})
export class PlaceInfoModule {
  static getComponent() {
    return PlaceInfoComponent;
  }
}
