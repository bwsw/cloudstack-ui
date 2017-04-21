import { Injectable } from '@angular/core';
import { BaseModel } from '../../models';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ListService {
  public onSelected = new Subject<BaseModel>();
  public onDeselected = new Subject<void>();
  public onAction = new Subject<void>();
}
