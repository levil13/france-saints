import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from '../../components/map/map.component';
import {MapService} from '../../services/map/map.service';

@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule],
  exports: [MapComponent],
  providers: [MapService],
})
export class MapModule {}
