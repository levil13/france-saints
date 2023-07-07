import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from 'rxjs';
import {Category} from '../../../models/rest/categories/categories.model';
import {StrapiResponseMulti} from '../../../models/rest/strapi-response.model';
import {LanguagesService} from '../languages/languages.service';

@Injectable()
export class CategoriesService {
  private apiUrl = 'http://localhost:1337/api';

  private categories$: Observable<Category[]> | undefined;

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getCategories() {
    if (!this.categories$) {
      this.categories$ = this.http
        .get<StrapiResponseMulti<Category>>(
          `${this.apiUrl}/categories?locale=${this.languagesService.selectedLanguage}`
        )
        .pipe(
          map(response => this.processResponse(response)),
          shareReplay(1)
        );
    }
    return this.categories$;
  }

  private processResponse(response: StrapiResponseMulti<Category>): Category[] {
    return response.data.map(categoryResponse => ({...categoryResponse.attributes, id: categoryResponse.id}));
  }
}
