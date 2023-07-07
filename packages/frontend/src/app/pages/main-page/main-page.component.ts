import {animate, style, transition, trigger} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Renderer2,
} from '@angular/core';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {LanguagesService} from '../../services/rest/languages/languages.service';
import {MapService} from '../../services/map/map.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({marginLeft: '-350px'}), animate('500ms ease-in-out', style({marginLeft: '0'}))]),
      transition(':leave', [animate('500ms ease-in-out', style({marginLeft: '-350px'}))]),
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({marginRight: '-482px'}), animate('500ms ease-in-out', style({marginRight: '0'}))]),
      transition(':leave', [animate('500ms ease-in-out', style({marginRight: '-482px'}))]),
    ]),
  ],
})
export class MainPageComponent implements AfterViewInit {
  private _searchResultsVisible = false;

  get searchResultsVisible(): boolean {
    return this._searchResultsVisible;
  }

  set searchResultsVisible(value: boolean) {
    this._searchResultsVisible = value;
    this.adjustZoomControlPosition(value);
    this.cdr.markForCheck();
  }

  private _searchResultsButtonVisible = false;

  get searchResultsButtonVisible(): boolean {
    return this._searchResultsButtonVisible;
  }

  set searchResultsButtonVisible(value: boolean) {
    this._searchResultsButtonVisible = value;
    this.cdr.markForCheck();
  }

  private _placeInfoModalVisible = false;

  get placeInfoModalVisible(): boolean {
    return this._placeInfoModalVisible;
  }

  set placeInfoModalVisible(value: boolean) {
    this._placeInfoModalVisible = value;
    this.cdr.markForCheck();
  }

  constructor(
    private placesService: PlacesService,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private placeService: PlaceService,
    private languageService: LanguagesService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private mapService: MapService,
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit() {
    this.searchService
      .getSearchResults()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(searchResults => {
        if (searchResults === null) return;

        this.searchResultsButtonVisible = true;
        this.searchResultsVisible = !!searchResults;
      });

    this.placeService
      .getSelectedPlace()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(selectedPlace => {
        this.placeInfoModalVisible = !!selectedPlace;
      });
  }

  private adjustZoomControlPosition(searchResultsVisible: boolean) {
    const controlElement = document.querySelector('.leaflet-control-zoom');
    searchResultsVisible
      ? this.renderer.addClass(controlElement, '!ml-[360px]')
      : this.renderer.removeClass(controlElement, '!ml-[360px]');
  }
}
