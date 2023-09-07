import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {PlaceService} from '../../services/place/place.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {forkJoin, of, switchMap, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Place} from '../../models/rest/places/places.model';
import {ContentWrapperComponent} from '../../components/content-wrapper/content-wrapper.component';
import {NgIf} from '@angular/common';
import {MarkdownPipe} from '../../pipes/markdown/markdown.pipe';
import {environment} from '../../../environments/environment';
import {MetaService} from '../../services/meta/meta.service';
import {MetaData} from '../../models/meta/meta.model';
import {translations} from '../../../locale/translations';

@Component({
  selector: 'app-place-page',
  templateUrl: './place-page.component.html',
  styleUrls: ['./place-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ContentWrapperComponent, MarkdownPipe],
})
export class PlacePageComponent {
  CMS_URL = environment.CMS_URL;

  selectedPlace: Place | null = null;
  selectedPlaceDescription: string | null = null;

  constructor(
    private placeService: PlaceService,
    private placesService: PlacesService,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.initSelectedPlace();
  }

  private initSelectedPlace() {
    const selectedPlaceObs$ = this.placeService.getSelectedPlaceSync()
      ? of(this.placeService.getSelectedPlaceSync())
      : this.findPlaceFromUrl();

    selectedPlaceObs$
      .pipe(
        tap(selectedPlace => this.processSelectedPlace(selectedPlace)),
        switchMap(selectedPlace =>
          forkJoin([of(selectedPlace as Place), this.placesService.getPlacePageInfo((selectedPlace as Place).id)])
        ),
        takeUntilDestroyed()
      )
      .subscribe(([selectedPlace, selectedPlacePageInfo]) => {
        this.selectedPlaceDescription = selectedPlacePageInfo.longDescription;

        const metaData: MetaData = {
          title: `${selectedPlace.name} - ${translations.defaultTitle}`,
          description: selectedPlacePageInfo.shortDescription,
          keywords: selectedPlacePageInfo.keywords,
        };

        this.metaService.updateMetaData(metaData);

        this.cdr.markForCheck();
      });
  }

  private processSelectedPlace(selectedPlace: Place | null) {
    if (selectedPlace) {
      this.selectedPlace = selectedPlace;
      this.placeService.setSelectedPlace(selectedPlace);
    } else {
      this.router.navigate(['/']);
    }
  }

  private findPlaceFromUrl() {
    const coordinates = this.activatedRoute.snapshot.params['place'];
    return this.placesService.getPlace(coordinates.replace(',', ', '));
  }
}
