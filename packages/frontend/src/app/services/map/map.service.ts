import {Injectable} from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map!: L.Map;

  initMap(element: HTMLElement, tileLayer: L.Layer, markersLayer: L.MarkerClusterGroup) {
    const markersLayerBounds = markersLayer.getBounds();

    this.map = new L.Map(element, {zoom: 6, minZoom: 6, center: markersLayerBounds.getCenter(), zoomControl: false})
      .addControl(L.control.zoom({position: 'bottomleft'}))
      .addLayer(tileLayer)
      .addLayer(markersLayer)
      .fitBounds(markersLayerBounds, {animate: false});
  }

  flyToBounds(bounds: L.LatLngBounds) {
    this.map.flyToBounds(bounds.pad(0.1), {animate: true, duration: 0.5});
  }

  flyTo(coords: L.LatLngExpression, zoom?: number) {
    this.map.flyTo(coords, zoom, {animate: true, duration: 0.5});
  }
}
