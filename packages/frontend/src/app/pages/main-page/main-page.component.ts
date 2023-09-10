import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Inject, Renderer2} from '@angular/core';
import {SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AsyncPipe, DOCUMENT, NgIf} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchResultsComponent} from '../../components/search-results/search-results.component';
import {MapComponent} from '../../components/map/map.component';
import {PlaceInfoComponent} from '../../components/place-info/place-info.component';
import {slideInOutLeft, slideInOutRight} from '../../../assets/animations/animations';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [slideInOutLeft, slideInOutRight],
  standalone: true,
  imports: [NgIf, HeaderComponent, SearchResultsComponent, MapComponent, PlaceInfoComponent, AsyncPipe],
})
export class MainPageComponent implements AfterViewInit {
  searchResultsVisible$ = new BehaviorSubject<boolean>(false);
  searchResultsButtonVisible$ = new BehaviorSubject<boolean>(false);
  placeInfoModalVisible$ = new BehaviorSubject<boolean>(false);

  constructor(
    private searchService: SearchService,
    private placeService: PlaceService,
    private renderer: Renderer2,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngAfterViewInit() {
    requestAnimationFrame(() => this.cdr.markForCheck());

    this.searchService
      .getSearchResults()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(searchResults => {
        if (searchResults === null) return;

        this.searchResultsButtonVisible$.next(true);
        this.searchResultsVisible$.next(!!searchResults);
      });

    this.placeService
      .getSelectedPlace()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(selectedPlace => {
        this.placeInfoModalVisible$.next(!!selectedPlace);
      });

    this.searchResultsVisible$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(visible => {
        this.adjustZoomControlPosition(visible);
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
