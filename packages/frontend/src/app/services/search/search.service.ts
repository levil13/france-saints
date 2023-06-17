import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SEARCH_TYPE = 'city' | 'category' | 'global';

export interface SearchEntity {
  term: string,
  type: SEARCH_TYPE,
  typeTerm: string
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  private searchEntity$ = new BehaviorSubject<SearchEntity | null>(null);

  setSearchEntity(entity: SearchEntity | null) {
    this.searchEntity$.next(entity);
  }

  getSearchEntity() {
    return this.searchEntity$.asObservable();
  }
}
