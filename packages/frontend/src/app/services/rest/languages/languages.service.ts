import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Language} from '../../../models/rest/languages/languages.model';
import {LocationStrategy} from '@angular/common';

@Injectable({providedIn: 'root'})
export class LanguagesService {
  private apiUrl = 'http://localhost:1337/api';

  private languages$ = new BehaviorSubject<Language[]>([]);

  //TODO move to env
  selectedLanguage: string;

  constructor(private http: HttpClient, private readonly locationStrategy: LocationStrategy) {
    this.selectedLanguage = this.locationStrategy.getBaseHref().replace(/\//g, '') || 'ru';
  }

  getLanguages() {
    return this.languages$.asObservable();
  }

  loadLanguages() {
    return this.http
      .get<Language[]>(`${this.apiUrl}/i18n/locales`)
      .pipe(tap(languages => this.languages$.next(languages)));
  }
}
