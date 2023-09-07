import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {MetaData} from '../../models/meta/meta.model';
import {translations} from '../../../locale/translations';

@Injectable({providedIn: 'root'})
export class MetaService {
  constructor(private title: Title, private meta: Meta) {}

  updateMetaData(metaData: MetaData) {
    this.title.setTitle(metaData?.title ?? translations.defaultTitle);
    this.meta.updateTag({name: 'description', content: (metaData?.description ?? translations.defaultDescription)});
    this.meta.updateTag({name: 'keywords', content: (metaData?.keywords ?? translations.defaultKeywords)});
  }
}
