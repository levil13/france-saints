import {Injectable} from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

  initMap(element: HTMLElement, layers: L.Layer[], center: L.LatLngExpression) {
    const map = new L.Map(element, {zoom: 6, minZoom: 6, center, zoomControl: false});

    layers.forEach(layer => map.addLayer(layer));

    this.map = map;
  }

  flyToBounds(bounds: L.LatLngBounds) {
    this.map.flyToBounds(bounds.pad(0.1), {animate: true, duration: 0.5});
  }

  flyTo(coords: L.LatLngExpression, zoom?: number) {
    this.map.flyTo(coords, zoom, {animate: true, duration: 0.5});
  }

  getZoom() {
    return this.map.getZoom();
  }
}
