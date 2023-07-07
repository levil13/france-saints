import {NgModule} from '@angular/core';
import {MapComponent} from '../../components/map/map.component';
import {MapService} from '../../services/map/map.service';

@NgModule({
  declarations: [MapComponent],
  exports: [MapComponent],
  providers: [MapService],
})
export class MapModule {}
