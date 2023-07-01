import {Injectable} from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

  initMap(element: HTMLElement, tileLayer: L.Layer) {
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
      .addLayer(tileLayer);
  }

  addMarkers(markersLayer: L.MarkerClusterGroup) {
    this.map.addLayer(markersLayer).fitBounds(markersLayer.getBounds(), {animate: false});
  }

  flyToBounds(bounds: L.LatLngBounds) {
    this.map.flyToBounds(bounds.pad(0.1), {animate: true, duration: 0.5});
  }

  flyTo(coords: L.LatLngExpression, zoom?: number) {
    this.map.flyTo(coords, zoom, {animate: true, duration: 0.5});
  }
}
