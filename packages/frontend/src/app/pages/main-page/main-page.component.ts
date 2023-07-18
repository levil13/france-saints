import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  Renderer2,
} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DOCUMENT, NgIf} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchResultsComponent} from '../../components/search-results/search-results.component';
import {MapComponent} from '../../components/map/map.component';
import {PlaceInfoComponent} from '../../components/place-info/place-info.component';
import {slideInOutLeft, slideInOutRight} from '../../../assets/animations/animations';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOutLeft, slideInOutRight],
  standalone: true,
  imports: [NgIf, HeaderComponent, SearchResultsComponent, MapComponent, PlaceInfoComponent],
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
    private searchService: SearchService,
    private placeService: PlaceService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    @Inject(DOCUMENT) private document: Document
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

  animationStart() {
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  animationDone() {
    this.renderer.setStyle(this.document.body, 'overflow', 'auto');
  }
}
