import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlaceService } from '../../services/place/place.service';
import { MapService } from '../../services/map/map.service';
import { Coordinates } from '../../models/rest/strapi-components.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  constructor(private placeService: PlaceService,
              private mapService: MapService) {}

  selectedPlace$ = this.placeService.getSelectedPlace();

  close() {
    this.placeService.setSelectedPlace(null);
  }

  zoom(coordinates: Coordinates) {
    this.mapService.flyTo([coordinates.latitude, coordinates.longitude], 18);
  }
}
