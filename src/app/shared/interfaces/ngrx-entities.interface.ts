// This interface represents Dictionary that used by ngrx/entity for returning type of selectEntities
// import { Dictionary } from '@ngrx/entity/src/models';
// This Dictionary class is not a part of public API, so we use custom interface

export interface NgrxEntities<T> {
  [id: string]: T;
  [id: number]: T;
}
