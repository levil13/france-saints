import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from 'rxjs';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';
import {City, CityResponse} from '../../../models/rest/cities/cities.model';
import {stringify} from 'qs';

@Injectable({providedIn: 'root'})
export class CitiesService {
  private apiUrl = 'http://localhost:1337/api';

  private cities$: Observable<City[]> | undefined;

  private citiesApiUrlPrefix = `${this.apiUrl}/cities`;

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getCities() {
    const query = stringify({fields: ['name', 'postalCodes']}, {encodeValuesOnly: true});

    if (!this.cities$) {
      this.cities$ = this.http
        .get<StrapiResponseMulti<CityResponse>>(
          `${this.citiesApiUrlPrefix}?locale=${this.languagesService.selectedLanguage}&${query}`
        )
        .pipe(
          map(response => this.processResponse(response)),
          shareReplay(1)
        );
    }

    return this.cities$;
  }

  private processResponse(response: StrapiResponseMulti<CityResponse>): City[] {
    return response.data.map(cityResponse => ({
      ...cityResponse.attributes,
      postalCodes: cityResponse.attributes.postalCodes.split(', '),
      id: cityResponse.id,
    }));
  }
}
