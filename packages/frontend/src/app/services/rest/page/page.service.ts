import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LanguagesService} from '../languages/languages.service';
import {StrapiResponseSingle} from '../../../models/rest/strapi-response.model';
import {PageModel} from '../../../models/rest/page/page.model';
import {map} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable()
export class PageService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient, private languagesService: LanguagesService) {}

  getPage(path: string) {
    return this.http
      .get<StrapiResponseSingle<PageModel>>(`${this.apiUrl}${path}?locale=${this.languagesService.selectedLanguage}`)
      .pipe(map(response => this.processResponse(response)));
  }

  private processResponse(response: StrapiResponseSingle<PageModel>): PageModel {
    return {...response.data.attributes, id: response.data.id};
  }
}
