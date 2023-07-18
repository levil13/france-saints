import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from 'rxjs';
import {Category, CategoryResponse} from '../../../models/rest/categories/categories.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';
import {stringify} from 'qs';

@Injectable({providedIn: 'root'})
export class CategoriesService {
  private apiUrl = 'http://localhost:1337/api';

  private categories$: Observable<Category[]> | undefined;

  private populateQuery = {populate: {icon: {fields: ['name', 'url', 'alternativeText']}}};

  private fieldsQuery = {fields: ['name']};

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getCategories() {
    const query = stringify({...this.fieldsQuery, ...this.populateQuery}, {encodeValuesOnly: true});

    if (!this.categories$) {
      this.categories$ = this.http
        .get<StrapiResponseMulti<CategoryResponse>>(
          `${this.apiUrl}/categories?locale=${this.languagesService.selectedLanguage}&${query}`
        )
        .pipe(
          map(response => this.processResponse(response)),
          shareReplay(1)
        );
    }
    return this.categories$;
  }

  private processResponse(response: StrapiResponseMulti<CategoryResponse>): Category[] {
    return response.data.map(categoryResponse => ({
      ...categoryResponse.attributes,
      id: categoryResponse.id,
      icon: categoryResponse.attributes.icon.data.attributes,
    }));
  }
}
