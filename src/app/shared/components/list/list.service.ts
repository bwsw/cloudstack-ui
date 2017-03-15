import { Injectable } from '@angular/core';
import { BaseModel } from '../../models/base.model';
import { Subject } from 'rxjs';


@Injectable()
export class ListService {
  public onSelected = new Subject<BaseModel>();
  public onDeselected = new Subject<void>();
  public onAction = new Subject<void>();
}
