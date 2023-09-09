import {MetaData} from '../app/models/meta/meta.model';
import {translations} from '../locale/translations';

export enum META_TAGS {
  title = 'title',
  description = 'description',
  keywords = 'keywords',
  viewport = 'viewport',
  'og:type' = 'og:type',
  'og:title' = 'og:title',
  'og:description' = 'og:description',
  'og:url' = 'og:url',
  'og:image' = 'og:image',
  'og:image:alt' = 'og:image:alt',
  'og:locale' = 'og:locale',
  'og:site_name' = 'og:site_name',
}

export const PERSISTENT_META_TAGS = [META_TAGS.viewport, META_TAGS.description, META_TAGS.keywords];

export const PATHS: Record<string, {url: string; metaData: MetaData}> = {
  '': {
    url: '',
    metaData: {
      title: translations.defaultTitle,
      description: translations.defaultDescription,
      keywords: translations.defaultKeywords,
    },
  },
  ABOUT: {
    url: 'about',
    metaData: {
      title: translations.aboutTitle,
      description: translations.aboutDescription,
      keywords: translations.aboutKeywords,
      customTags: new Map([[META_TAGS['og:site_name'], translations.defaultTitle]]),
    },
  },
  CONTACTS: {
    url: 'contacts',
    metaData: {
      title: translations.contactsTitle,
      description: translations.contactsDescription,
      keywords: translations.contactsKeywords,
      customTags: new Map([[META_TAGS['og:site_name'], translations.defaultTitle]]),
    },
  },
};
