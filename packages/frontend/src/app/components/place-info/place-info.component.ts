import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceInfoComponent {
  constructor(private placeService: PlaceService) {}

  selectedPlace$ = this.placeService.getSelectedPlace();

  close() {
    this.placeService.setSelectedPlace(null);
  }
}
