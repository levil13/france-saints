import {Injectable} from '@angular/core';
import {Observable, shareReplay} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Language} from '../../../models/rest/languages/languages.model';
import {LocationStrategy} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LanguagesService {
  private apiUrl = environment.API_URL;

  private i18nApiUrl = `${this.apiUrl}i18n`;

  private DEFAULT_LANGUAGE = environment.DEFAULT_LANGUAGE;

  private languages$: Observable<Language[]> | undefined;

  selectedLanguage: string;

  constructor(private http: HttpClient, private readonly locationStrategy: LocationStrategy) {
    this.selectedLanguage = this.locationStrategy.getBaseHref().replace(/\//g, '') || this.DEFAULT_LANGUAGE;
  }

  getLanguages() {
    if (!this.languages$) {
      this.languages$ = this.http.get<Language[]>(`${this.i18nApiUrl}/locales`).pipe(shareReplay(1));
    }

    return this.languages$;
  }
}
