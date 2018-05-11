import { DictionaryNum } from '@ngrx/entity/src/models';

export declare abstract class Dictionary<T> implements DictionaryNum<T> {
  [id: string]: T;
}
