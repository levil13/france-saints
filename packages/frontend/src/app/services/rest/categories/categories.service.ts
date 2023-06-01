import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { Category } from '../../../models/rest/categories/categories.model';
import { StrapiResponseMulti } from '../../../models/rest/strapi-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://localhost:1337/api';

  private categories$ = new BehaviorSubject<Category[]>([]);

  constructor(private http: HttpClient) {}

  getCategories() {
    return this.categories$.asObservable();
  }

  loadCategories() {
    return this.http.get<StrapiResponseMulti<Category>>(`${this.apiUrl}/categories`).pipe(
      map(response => this.processResponse(response)),
      tap(categories => this.categories$.next(categories))
    );
  }

  private processResponse(response: StrapiResponseMulti<Category>) {
    return response.data.map(categoryResponse => ({ ...categoryResponse.attributes, id: categoryResponse.id }));
  }
}