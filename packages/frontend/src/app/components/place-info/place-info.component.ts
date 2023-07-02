import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';
import {Place} from '../../models/rest/places/places.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceInfoComponent {
  constructor(private placeService: PlaceService, private router: Router) {}

  selectedPlace$ = this.placeService.getSelectedPlace();

  close() {
    this.placeService.setSelectedPlace(null);
  }

  navigateToPlace(selectedPlace: Place) {
    const placeRoute = `${selectedPlace.coordinates.latitude},${selectedPlace.coordinates.longitude}`;
    this.router.navigate(['places', placeRoute]);
  }
}
