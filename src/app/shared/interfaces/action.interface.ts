import { Observable } from 'rxjs/Observable';
import { BaseModel, BaseModelInterface } from '../models/base.model';


export interface Action<M extends BaseModel | BaseModelInterface> {
  name: string;
  icon?: string;
  hidden?(model: M): boolean;
  canActivate?(model: M): boolean;
  activate(model: M, ...rest: Array<any>): Observable<any>;
}
