import { BaseModelInterface } from '../models';
import { Action } from './action.interface';


export interface ActionsService<M extends BaseModelInterface, A extends Action<M>> {
  actions: Array<A>;
}
