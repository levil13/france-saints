import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Place} from '../../models/rest/places/places.model';

@Injectable({providedIn: 'root'})
export class PlaceService {
  private selectedPlace$ = new BehaviorSubject<Place | null>(null);

  setSelectedPlace(entity: Place | null) {
    if (entity?.id === this.selectedPlace$.value?.id) return;

    this.selectedPlace$.next(entity);
  }

  getSelectedPlace() {
    return this.selectedPlace$.asObservable();
  }
}
