import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {of, switchMap, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Place} from '../../models/rest/places/places.model';

@Component({
  selector: 'app-place-page',
  templateUrl: './place-page.component.html',
  styleUrls: ['./place-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlacePageComponent {
  selectedPlace: Place | null = null;

  constructor(
    private placeService: PlaceService,
    private placesService: PlacesService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initSelectedPlace();
  }

  private initSelectedPlace() {
    this.placeService
      .getSelectedPlace()
      .pipe(
        switchMap(selectedPlace =>
          selectedPlace ? of(selectedPlace) : this.findPlaceFromUrl()),
        tap(selectedPlace =>
          selectedPlace ? this.placeService.setSelectedPlace(selectedPlace) : this.router.navigate(['/'])
        ),
        takeUntilDestroyed()
      )
      .subscribe(selectedPlace => {
        this.selectedPlace = selectedPlace;
        this.cdr.markForCheck();
      });
  }

  private findPlaceFromUrl() {
    const coordinates = this.activatedRoute.snapshot.params['place'];
    return this.placesService.findPlace(coordinates.replace(',', ', '));
  }
}
