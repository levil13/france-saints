import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import {map, Observable, Subject, tap} from 'rxjs';
import {CategoriesService} from '../../services/rest/categories/categories.service';
import {SEARCH_TYPE, SearchService} from '../../services/search/search.service';
import {PlaceService} from '../../services/place/place.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {translations} from '../../../locale/translations';
import {City} from '../../models/rest/cities/cities.model';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {ClickOutsideDirective} from '../../directives/click-outside/click-outside.directive';
import {FormsModule} from '@angular/forms';
import {Category} from '../../models/rest/categories/categories.model';
import {CitiesService} from '../../services/rest/cities/cities.service';
import {fade} from '../../../assets/animations/animations';
import {DropdownNavigationDirective} from '../../directives/dropdown-navigation/dropdown-navigation.directive';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [fade],
  imports: [NgIf, NgFor, ClickOutsideDirective, DropdownNavigationDirective, FormsModule, AsyncPipe],
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

  categories$: Observable<Category[]> = this.categoriesService.getCategories();

  cities: City[] = [];

  filteredCities: City[] = [];

  private selectedButton: ElementRef | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private categoriesService: CategoriesService,
    private searchService: SearchService,
    private placeService: PlaceService,
    private citiesService: CitiesService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.citiesService
      .getCities()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(cities => (this.cities = cities));

    this.initSearchValueChangeHandler();
  }

  ngAfterViewInit() {
    this.updateSearchValue(this.searchService.getSearchEntitySync()?.term ?? '');
  }

  updateSearchValue(value: string) {
    this.searchValue = value;
    this.searchValueChange$.next({value: this.searchValue, initial: true});
  }

  private initSearchValueChangeHandler() {
    this.searchValueChange$
      .pipe(
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
