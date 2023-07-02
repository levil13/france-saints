import {NgModule} from '@angular/core';
import {PlaceInfoComponent} from '../../components/place-info/place-info.component';
import {CarouselComponent} from '../../components/carousel/carousel.component';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@NgModule({
  declarations: [PlaceInfoComponent, CarouselComponent],
  imports: [CommonModule, RouterLink],
})
export class PlaceInfoModule {
  static getComponent() {
    return PlaceInfoComponent;
  }
}
