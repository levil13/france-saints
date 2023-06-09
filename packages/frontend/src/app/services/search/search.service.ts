import {Injectable} from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {Place} from '../../models/rest/places/places.model';
import {PlacesService} from '../rest/places/places.service';
import {MapService} from '../map/map.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type SEARCH_TYPE = 'city' | 'category' | 'global';

export interface SearchEntity {
  term: string;
  type: SEARCH_TYPE;
  typeTerm: string;
}

@Injectable()
export class SearchService {
  searchEntity$ = new BehaviorSubject<SearchEntity | null>(null);

  setSearchEntity(entity: SearchEntity) {
    this.searchEntity$.next(entity);
  }

  private searchResults$ = new BehaviorSubject<Place[] | null>(null);

  setSearchResults(places: Place[]) {
    this.searchResults$.next(places);
  }

  getSearchResults() {
    return this.searchResults$.asObservable();
  }

  private places: Place[] = [];

  constructor(private placesService: PlacesService, private mapService: MapService) {
    this.placesService
      .getPlaces()
      .pipe(takeUntilDestroyed())
      .subscribe(places => (this.places = places));

    this.searchEntity$
      .pipe(filter(entity => !!entity))
      .pipe(takeUntilDestroyed())
      .subscribe(entity => {
        const filteredPlaces = this.searchPlaces(entity as SearchEntity);

        this.setSearchResults(filteredPlaces);

        if (entity?.type === 'city') {
          this.flyToCity(filteredPlaces);
        }
      });
  }

  private searchPlaces(searchEntity: SearchEntity) {
    switch (searchEntity.type) {
      case 'city':
        return this.places.filter(place => place.city.name === searchEntity.typeTerm);
      case 'category':
        return this.places.filter(place => {
          const typeFilter = place.category.name === searchEntity.typeTerm;
          const nameFilter = place.name.toLowerCase().includes(searchEntity.term.toLowerCase());

          return typeFilter && nameFilter;
        });
      case 'global':
        return this.places.filter(place => place.name.toLowerCase().includes(searchEntity.term.toLowerCase()));
      default:
        return [];
    }
  }

  private flyToCity(cityPlaces: Place[]) {
    const cityBoundsCoords = cityPlaces.map(place => [place.coordinates.latitude, place.coordinates.longitude]);
    this.mapService.flyToBounds(cityBoundsCoords as [number, number][]);
  }
}
