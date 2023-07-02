import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {of, switchMap} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-place-page',
  templateUrl: './place-page.component.html',
  styleUrls: ['./place-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacePageComponent {
  constructor(
    private placeService: PlaceService,
    private placesService: PlacesService,
    private activatedRoute: ActivatedRoute
  ) {}

  selectedPlace$ = this.placeService.getSelectedPlace().pipe(
    switchMap(selectedPlace => {
      if (!selectedPlace) {
        const coordinates = this.activatedRoute.snapshot.params['place'];
        return this.placesService.findPlace(coordinates.replace(',', ', '));
      }
      return of(selectedPlace);
    })
  );
}
