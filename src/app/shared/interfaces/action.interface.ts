import { Observable } from 'rxjs';
import { BaseModel } from '../models';

export interface Action<M extends BaseModel> {
  name: string;
  icon?: string;
  hidden?(model: M): boolean;
  canActivate?(model: M): boolean;
  activate?(model: M, ...rest: any[]): Observable<any>;
}
