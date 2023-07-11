import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {debounceTime, map, Subject, tap} from 'rxjs';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {PlacesService} from '../../services/rest/places/places.service';
import {SEARCH_TYPE, SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {translations} from '../../../locale/translations';
import {City} from '../../models/rest/cities/cities.model';
import {Place} from '../../models/rest/places/places.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, AfterViewInit {
  placeholder = translations.searchPlaceholder;

  private _dropdownVisible = false;

  public get dropdownVisible() {
    return this._dropdownVisible;
  }

  public set dropdownVisible(value) {
    this._dropdownVisible = value;
    this.selectedButton = undefined;
    this.cdr.markForCheck();
  }

  @Input()
  mobileSearchOpened = false;

  searchValue = '';
  searchValueChange$ = new Subject<{value: string; initial?: boolean}>();

  categoriesNames: string[] = [];
  cities: City[] = [];

  filteredCities: City[] = [];

  @HostListener('window:keyup', ['$event'])
  keyHandler(event: KeyboardEvent) {
    this.checkAndHandleDownClick(event);
  }

  @ViewChildren('dropDownButton', {read: ElementRef})
  private dropDownButtons: QueryList<ElementRef> | undefined;

  private selectedButton: ElementRef | undefined;

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
      .subscribe(places => (this.cities = this.getCities(places)));

    this.initSearchValueChangeHandler();
  }

  ngAfterViewInit() {
    this.searchValue = this.searchService.searchEntity$.value?.term ?? '';
    this.searchValueChange$.next({value: this.searchValue, initial: true});
  }

  private getCities(places: Place[]) {
    const citiesMap: Map<string, City> = new Map();

    places.forEach(place => {
      if (citiesMap.has(place.city.name)) return;
      citiesMap.set(place.city.name, place.city);
    });

    return Array.from(citiesMap.values());
  }

  private initSearchValueChangeHandler() {
    this.searchValueChange$
      .pipe(
        debounceTime(300),
        tap(valueChange => (this.dropdownVisible = !!valueChange.value.length && !valueChange.initial)),
        map(valueChange => valueChange.value.trim()),
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

    this.filteredCities = this.cities
      .filter(city => city.name.match(searchValueRegExp) || city.postalCodes.some(code => code.includes(searchValue)))
      .slice(0, 5)
      .map(filteredCity => {
        const name = filteredCity.name.replace(searchValueRegExp, '<b>$&</b>');
        const postalCodes = filteredCity.postalCodes.map(postalCode => postalCode.replace(searchValue, '<b>$&</b>'));

        return {...filteredCity, name, postalCodes};
      });
  }

  private checkAndHandleDownClick(event: KeyboardEvent) {
    if (!this.dropdownVisible || !this.dropDownButtons) return;

    if (!this.selectedButton) {
      if (event.key === 'ArrowDown') {
        this.selectedButton = this.dropDownButtons.first;
      }

      if (event.key === 'ArrowUp') {
        this.selectedButton = this.dropDownButtons.last;
      }
    } else {
      const selectedButtonIndex = Array.from(this.dropDownButtons).indexOf(this.selectedButton);
      let newSelectedButton;

      if (event.key === 'ArrowDown') {
        if (selectedButtonIndex === this.dropDownButtons.length - 1) {
          newSelectedButton = this.dropDownButtons.first;
        } else {
          newSelectedButton = this.dropDownButtons.get(selectedButtonIndex + 1);
        }
      }

      if (event.key === 'ArrowUp') {
        if (selectedButtonIndex === 0) {
          newSelectedButton = this.dropDownButtons.last;
        } else {
          newSelectedButton = this.dropDownButtons.get(selectedButtonIndex - 1);
        }
      }

      if (newSelectedButton) {
        this.selectedButton = newSelectedButton;
      }
    }

    this.selectedButton?.nativeElement.focus();
  }

  searchValueChange(value: string) {
    this.searchValueChange$.next({value});
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

  onInputFocus(input: HTMLInputElement) {
    this.dropdownVisible = !!this.searchValue;
    input.classList.add('_gray');
  }

  onInputBlur(input: HTMLInputElement) {
    input.classList.remove('_gray');
  }
}
