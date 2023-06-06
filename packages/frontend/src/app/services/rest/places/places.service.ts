import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {stringify} from 'qs';
import {BehaviorSubject, map, tap} from 'rxjs';
import {Place, PlaceResponse} from '../../../models/rest/places/places.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private apiUrl = 'http://localhost:1337/api';

  private places$ = new BehaviorSubject<Place[]>([]);

  constructor(private http: HttpClient) {}

  getPlaces() {
    return this.places$.asObservable();
  }

  loadPlaces() {
    const query = stringify({populate: ['coordinates', 'category', 'category.icon', 'city']}, {encodeValuesOnly: true});

    return this.http
      .get<StrapiResponseMulti<PlaceResponse>>(`${this.apiUrl}/places?${query}`)
      .pipe(map(response => this.processResponse(response)))
      .pipe(tap(places => this.places$.next(places)));
  }

  private processResponse(response: StrapiResponseMulti<PlaceResponse>) {
    const places: Place[] = response.data.map(placeResponse => {
      const placeId = placeResponse.id;
      const placeAttrs = placeResponse.attributes;
      const placeCategory = placeAttrs.category.data.attributes;
      const placeCategoryIcon = placeAttrs.category.data.attributes.icon.data.attributes;
      const placeCity = placeAttrs.city.data.attributes;

      return {...placeAttrs, id: placeId, category: {...placeCategory, icon: placeCategoryIcon}, city: placeCity};
    });

    return places;
  }
}
