import {StrapiBaseEntity} from "./strapi-base.model";

export interface Coordinates extends StrapiBaseEntity {
  latitude: number;
  longitude: number;
}
