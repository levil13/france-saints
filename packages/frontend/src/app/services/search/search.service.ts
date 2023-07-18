import {Injectable} from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {Place} from '../../models/rest/places/places.model';
import {PlacesService} from '../rest/places/places.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type SEARCH_TYPE = 'city' | 'category' | 'global';

export interface SearchEntity {
  term: string;
  type: SEARCH_TYPE;
  typeTerm: string;
}

@Injectable({providedIn: 'root'})
export class SearchService {
  private searchEntity$ = new BehaviorSubject<SearchEntity | null>(null);

  setSearchEntity(entity: SearchEntity) {
    this.searchEntity$.next(entity);
  }

  getSearchEntity() {
    return this.searchEntity$.asObservable();
  }

  getSearchEntitySync() {
    return this.searchEntity$.value;
  }

  private searchResults$ = new BehaviorSubject<Place[] | null>(null);

  setSearchResults(places: Place[]) {
    this.searchResults$.next(places);
  }

  getSearchResults() {
    return this.searchResults$.asObservable();
  }

  private places: Place[] = [];

  constructor(private placesService: PlacesService) {
    this.placesService
      .getPlaces()
      .pipe(takeUntilDestroyed())
      .subscribe(places => (this.places = places));

    this.searchEntity$
      .pipe(
        filter(entity => !!entity),
        takeUntilDestroyed()
      )
      .subscribe(entity => this.setSearchResults(this.searchPlaces(entity as SearchEntity)));
  }

  private searchPlaces(searchEntity: SearchEntity) {
    switch (searchEntity.type) {
      case 'city':
        return this.places.filter(place => place.city?.name === searchEntity.typeTerm);
      case 'category':
        return this.places.filter(place => {
          const typeFilter = place.category?.name === searchEntity.typeTerm;
          const nameFilter = place.name.toLowerCase().includes(searchEntity.term.toLowerCase());

          return typeFilter && nameFilter;
        });
      case 'global':
        return this.places.filter(place => place.name.toLowerCase().includes(searchEntity.term.toLowerCase()));
      default:
        return [];
    }
  }
}
