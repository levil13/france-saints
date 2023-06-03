import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Place } from '../../models/rest/places/places.model';
import { MapService } from '../map/map.service';
import { PlacesService } from '../rest/places/places.service';
import * as L from 'leaflet';
import { LatLngBoundsLiteral } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  private selectedPlace$ = new BehaviorSubject<Place | null>(null);

  constructor(private mapService: MapService,
              private placesService: PlacesService) {}

  setSelectedPlace(entity: Place | null) {
    if (entity && entity !== this.selectedPlace$.getValue()) {
      this.placesService.getPlaces()
        .subscribe(places => {
          const cityPlacesCoords: LatLngBoundsLiteral = places
            .filter(place => place.city.name === entity.city.name)
            .map(place => [place.coordinates.latitude, place.coordinates.longitude]);

          this.mapService.flyToBounds(new L.LatLngBounds(cityPlacesCoords));
        });
    }

    this.selectedPlace$.next(entity);
  }

  getSelectedPlace() {
    return this.selectedPlace$.asObservable();
  }
}
