import {Injectable} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Language} from '../../../models/rest/languages/languages.model';
import {LocationStrategy} from '@angular/common';

@Injectable({providedIn: 'root'})
export class LanguagesService {
  private apiUrl = 'http://localhost:1337/api';

  private languages$: Observable<Language[]> | undefined;

  //TODO move to env
  selectedLanguage: string;

  constructor(private http: HttpClient, private readonly locationStrategy: LocationStrategy) {
    this.selectedLanguage = this.locationStrategy.getBaseHref().replace(/\//g, '') || 'ru';
  }

  getLanguages() {
    if (!this.languages$) {
      this.languages$ = this.http.get<Language[]>(`${this.apiUrl}/i18n/locales`).pipe(shareReplay(1));
    }

    return this.languages$;
  }
}
