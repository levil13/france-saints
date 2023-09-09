import {Inject, Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {MetaData} from '../../models/meta/meta.model';
import {translations} from '../../../locale/translations';
import {DOCUMENT} from '@angular/common';
import {META_TAGS, PERSISTENT_META_TAGS} from '../../../constants/constants';
import {Image} from '../../models/rest/strapi-components.model';

@Injectable({providedIn: 'root'})
export class MetaService {
  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private document: Document) {}

  updateMetaData(metaData?: MetaData) {
    this.clearAllTags();

    this.updateMandatoryTags(metaData);

    if (metaData?.customTags) {
      this.updateTags(metaData.customTags);
    }
  }

  private clearAllTags() {
    const metaTagsToClear = Array.from(this.document.getElementsByTagName('meta')).filter(tag => {
      const charsetAttr = tag.getAttribute('charset');
      if (charsetAttr) return false;

      const nameAttr = tag.getAttribute('name');
      if (!nameAttr) return true;

      return !PERSISTENT_META_TAGS.includes(nameAttr as META_TAGS);
    });

    metaTagsToClear.forEach(tag => tag.remove());
  }

  private updateMandatoryTags(metaData?: MetaData) {
    this.title.setTitle(metaData?.title ?? translations.defaultTitle);

    const mandatoryTags = new Map<string, string>();
    mandatoryTags.set(META_TAGS['og:title'], metaData?.title ?? translations.defaultTitle);
    mandatoryTags.set(META_TAGS.description, metaData?.description ?? translations.defaultDescription);
    mandatoryTags.set(META_TAGS['og:description'], metaData?.description ?? translations.defaultDescription);
    mandatoryTags.set(META_TAGS.keywords, metaData?.keywords ?? translations.defaultKeywords);
    mandatoryTags.set(META_TAGS['og:url'], window.location.href);

    const language = window.location.pathname.slice(1).split('/').shift() as string;
    mandatoryTags.set(META_TAGS['og:locale'], `${language}_${language.toUpperCase()}`);

    if (metaData?.images?.length) {
      this.addImageTags(metaData.images);
    } else {
      const imageUrl = `${window.location.origin}/${language}/assets/images/og-${language}.jpg`;
      mandatoryTags.set(META_TAGS['og:image'], imageUrl);
      mandatoryTags.set(META_TAGS['og:image:alt'], translations.defaultTitle);
    }

    this.updateTags(mandatoryTags);
  }

  private addImageTags(images: Image[]) {
    const ogImageTag = META_TAGS['og:image'];
    const ogImageAltTag = META_TAGS['og:image:alt'];
    images.forEach(image => {
      this.meta.addTag({name: ogImageTag, property: ogImageTag, content: image.url});
      if (image.alternativeText) {
        this.meta.addTag({name: ogImageAltTag, property: ogImageAltTag, content: image.alternativeText});
      }
    });
  }

  private updateTags(metaTags: Map<string, string>) {
    for (const [name, content] of metaTags.entries()) {
      this.meta.updateTag({name, property: name, content});
    }
  }
}
