import { Observable } from 'rxjs/Observable';
import { BaseModelInterface } from '../models';


export interface Action<M extends BaseModelInterface> {
  name: string;
  icon?: string;
  hidden?(model: M): boolean;
  canActivate?(model: M): boolean;
  activate?(model: M, ...rest: Array<any>): Observable<any>;
}
