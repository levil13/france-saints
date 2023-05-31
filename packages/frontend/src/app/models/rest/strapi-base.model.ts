export interface StrapiBaseEntity {
  id: number;
}

export interface StrapiBaseEntityLocalized extends StrapiBaseEntity {
  locale: string;
}
