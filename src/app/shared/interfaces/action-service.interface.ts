import { Action } from './action.interface';
import { BaseModel, BaseModelInterface } from '../models';


export interface ActionsService<M extends BaseModelInterface | BaseModel, A extends Action<M>> {
  actions: Array<A>;
}
