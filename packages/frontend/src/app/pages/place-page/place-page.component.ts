import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Renderer2} from '@angular/core';
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
export class PlacePageComponent implements OnDestroy {
  selectedPlace: Place | null = null;
  bodyEl = document.querySelector('body');

  constructor(
    private placeService: PlaceService,
    private placesService: PlacesService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(this.bodyEl, 'overflow', 'auto');
    this.initSelectedPlace();
  }

  ngOnDestroy() {
    this.renderer.removeStyle(this.bodyEl, 'overflow');
  }

  private initSelectedPlace() {
    this.placeService
      .getSelectedPlace()
      .pipe(
        switchMap(selectedPlace => {
          if (selectedPlace) {
            return of(selectedPlace);
          }
          return this.findPlaceFromUrl();
        }),
        tap(selectedPlace => {
          if (!selectedPlace) {
            this.router.navigate(['/']);
          } else {
            this.placeService.setSelectedPlace(selectedPlace);
          }
        }),
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
