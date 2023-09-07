import {MetaData} from '../app/models/meta/meta.model';
import {translations} from '../locale/translations';

export const PATHS: Record<string, {url: string; metaData: MetaData}> = {
  ABOUT: {
    url: 'about',
    metaData: {
      title: translations.aboutTitle,
      description: translations.aboutDescription,
      keywords: translations.aboutKeywords,
    },
  },
  CONTACTS: {
    url: 'contacts',
    metaData: {
      title: translations.contactsTitle,
      description: translations.contactsDescription,
      keywords: translations.contactsKeywords,
    },
  },
};
