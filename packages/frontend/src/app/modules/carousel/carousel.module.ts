import {NgModule} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {CarouselComponent} from '../../components/carousel/carousel.component';

@NgModule({
  declarations: [CarouselComponent],
  imports: [NgIf, NgFor],
  exports: [CarouselComponent],
})
export class CarouselModule {}
