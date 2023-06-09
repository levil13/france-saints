import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Place} from '../../models/rest/places/places.model';
import {MapService} from '../map/map.service';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private selectedPlace$ = new BehaviorSubject<Place | null>(null);

  constructor(private mapService: MapService) {}

  setSelectedPlace(entity: Place | null) {
    if (entity && this.mapService.getZoom() !== 18) {
      this.mapService.flyTo({lat: entity.coordinates.latitude, lng: entity.coordinates.longitude}, 18);
    }
    this.selectedPlace$.next(entity);
  }

  getSelectedPlace() {
    return this.selectedPlace$.asObservable();
  }
}
