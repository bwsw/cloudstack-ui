import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
import { SecurityGroupAction, SecurityGroupActionType } from './sg-action';


@Injectable()
export class SecurityGroupRemoveAction extends SecurityGroupAction {
  public id = SecurityGroupActionType.Delete;
  public name = 'COMMON.DELETE';
  public icon = 'delete';

  public activate(securityGroup: SecurityGroup): Observable<any> {
    return Observable.of(null);
  }
}
