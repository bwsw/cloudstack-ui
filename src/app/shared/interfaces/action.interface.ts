import { Observable } from 'rxjs';
import { BaseModelInterface } from '../models';

export interface Action<M extends BaseModelInterface> {
  name: string;
  icon?: string;
  hidden?(model: M): boolean;
  canActivate?(model: M): boolean;
  activate?(model: M, ...rest: any[]): Observable<any>;
}
