import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {stringify} from 'qs';
import {BehaviorSubject, map, tap} from 'rxjs';
import {Coordinates, Place, PlaceResponse} from '../../../models/rest/places/places.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private apiUrl = 'http://localhost:1337/api';

  private places$ = new BehaviorSubject<Place[]>([]);

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getPlaces() {
    return this.places$.asObservable();
  }

  loadPlaces() {
    const query = stringify(
      {populate: ['coordinates', 'images', 'category', 'category.icon', 'city']},
      {encodeValuesOnly: true}
    );

    return this.http
      .get<StrapiResponseMulti<PlaceResponse>>(
        `${this.apiUrl}/places?locale=${this.languagesService.currentLanguageCode}&${query}`
      )
      .pipe(
        map(response => this.processResponse(response)),
        tap(places => this.places$.next(places))
      );
  }

  private processResponse(response: StrapiResponseMulti<PlaceResponse>) {
    const places: Place[] = response.data
      .filter(placeResponse => placeResponse.attributes.coordinates)
      .map(placeResponse => {
        const placeId = placeResponse.id;
        const placeAttrs = placeResponse.attributes;
        const placeCategory = placeAttrs.category.data.attributes;
        const placeCategoryIcon = placeAttrs.category.data.attributes.icon.data?.attributes;
        const placeCity = placeAttrs.city.data.attributes;
        const placeImages = placeAttrs.images?.data?.map(image => ({...image.attributes, id: image.id}));
        const placeCoordinates = this.processPlaceCoordinates(placeResponse.attributes.coordinates);

        return {
          ...placeAttrs,
          id: placeId,
          category: {...placeCategory, icon: placeCategoryIcon},
          city: placeCity,
          images: placeImages,
          coordinates: placeCoordinates,
        };
      });

    return places;
  }

  private processPlaceCoordinates(coordinates: string): Coordinates {
    const coordinatesSplit = coordinates.split(', ');
    return {latitude: +coordinatesSplit[0], longitude: +coordinatesSplit[1]};
  }
}
