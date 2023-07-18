import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';
import {Place, PlaceInfo} from '../../models/rest/places/places.model';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {CarouselComponent} from '../carousel/carousel.component';
import {filter, Observable, switchMap} from 'rxjs';
import {PlacesService} from '../../services/rest/places/places.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-place-info',
  templateUrl: './place-info.component.html',
  styleUrls: ['./place-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, AsyncPipe, CarouselComponent, RouterLink],
  standalone: true,
})
export class PlaceInfoComponent {
  selectedPlace$: Observable<Place | null> = this.placeService.getSelectedPlace();
  selectedPlaceInfo$: Observable<PlaceInfo>;

  constructor(private placeService: PlaceService, private placesService: PlacesService, private router: Router) {
    this.selectedPlaceInfo$ = this.placeService.getSelectedPlace().pipe(
      filter(place => !!place),
      switchMap(place => this.placesService.getPlaceInfo((place as Place).id)),
      takeUntilDestroyed()
    );
  }

  close() {
    this.placeService.setSelectedPlace(null);
  }

  navigateToPlace(selectedPlace: Place) {
    const placeRoute = `${selectedPlace.coordinates.latitude},${selectedPlace.coordinates.longitude}`;
    this.router.navigate(['places', placeRoute]);
  }
}
