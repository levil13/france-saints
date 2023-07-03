import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import {debounceTime, map, Subject, tap} from 'rxjs';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {SEARCH_TYPE, SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  placeholder = $localize`:@@search_placeholder:Имя, город, почтовый индекс...`;

  private _dropdownVisible = false;

  public get dropdownVisible() {
    return this._dropdownVisible;
  }

  public set dropdownVisible(value) {
    this._dropdownVisible = value;
    this.cdr.markForCheck();
  }

  searchValue = '';
  searchValueChange$ = new Subject<string>();

  categoriesNames: string[] = [];
  citiesNames: string[] = [];

  filteredCitiesNames: string[] = [];

  @HostListener('document:click', ['$event'])
  clickHandler(event: Event) {
    this.checkAndHandleOutsideClick(event);
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private placesService: PlacesService,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private placeService: PlaceService,
    private elementRef: ElementRef,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.categoriesService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(categories => (this.categoriesNames = categories.map(category => category.name)));

    this.placesService
      .getPlaces()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(places => {
        this.citiesNames = Array.from(
          new Set(places.reduce((arr: string[], place) => arr.concat(place.city.name), []))
        );
      });

    this.initSearchValueChangeHandler();
  }

  private initSearchValueChangeHandler() {
    this.searchValueChange$
      .pipe(
        debounceTime(300),
        map(value => value.trim()),
        tap(value => (this.dropdownVisible = !!value.length)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(searchValue => this.filterCities(searchValue));
  }

  private filterCities(searchValue: string) {
    const searchValueRegExp = new RegExp(
      searchValue
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .split(' ')
        .join('\\s*'),
      'gi'
    );
    this.filteredCitiesNames = this.citiesNames
      .filter(cityName => cityName.match(searchValueRegExp))
      .map(filteredCityName => filteredCityName.replace(searchValueRegExp, '<b>$&</b>'));
  }

  private checkAndHandleOutsideClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownVisible = false;
    }
  }

  searchValueChange(value: string) {
    this.searchValueChange$.next(value);
  }

  searchEntitySelect(typeTerm: string, type: SEARCH_TYPE) {
    if (type === 'city') {
      this.searchValue = typeTerm;
      this.filterCities(typeTerm);
      this.placeService.setSelectedPlace(null);
    }

    this.dropdownVisible = false;
    this.searchService.setSearchEntity({term: this.searchValue, typeTerm, type});
  }
}
