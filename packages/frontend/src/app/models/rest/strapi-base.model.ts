import {MetaData} from '../meta/meta.model';

export type StrapiBaseMetaDataEntity = StrapiBaseEntity & MetaData;

export interface StrapiBaseEntity {
  id: number;
}

export interface StrapiBaseEntityLocalized extends StrapiBaseEntity {
  locale: string;
}
