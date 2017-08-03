import { Action } from './action.interface';
import { BaseModel } from '../models/base.model';


export interface ActionsService<M extends BaseModel, A extends Action<M>> {
  actions: Array<A>;
}
