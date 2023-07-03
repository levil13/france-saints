import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Coordinates} from '../../models/rest/places/places.model';
import {Observable} from 'rxjs';

@Injectable()
export class MapService {
  private map!: L.Map;

  initMap(element: HTMLElement, tileLayer: L.Layer) {
    return new Observable<void>(subscriber => {
      const franceBounds = new L.LatLngBounds([40.86, -6.38], [51.64, 10.41]);

      this.map = new L.Map(element, {
        zoom: 6,
        minZoom: 6,
        center: franceBounds.getCenter(),
        maxBounds: franceBounds,
        maxBoundsViscosity: 1,
        zoomControl: false,
      })
        .addControl(L.control.zoom({position: 'bottomleft'}))
        .addLayer(tileLayer)
        .whenReady(() => {
          subscriber.next();
          subscriber.complete();
        });
    });
  }

  addMarkers(markersLayer: L.MarkerClusterGroup) {
    this.map.addLayer(markersLayer).fitBounds(markersLayer.getBounds(), {animate: false});
  }

  flyToBounds(bounds: L.LatLngBounds | [number, number][]) {
    if (!(bounds instanceof L.LatLngBounds)) {
      bounds = new L.LatLngBounds(bounds);
    }
    this.map.flyToBounds(bounds.pad(0.1), {animate: true, duration: 0.5});
  }

  flyTo(coords: Coordinates) {
    this.map.flyTo({lat: coords.latitude, lng: coords.longitude}, 15, {animate: true, duration: 0.5});
  }
}
