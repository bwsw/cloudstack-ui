import { BaseModel } from '../models';
import { Action } from './action.interface';

export interface ActionsService<M extends BaseModel, A extends Action<M>> {
  actions: A[];
}
