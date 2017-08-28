import { SecurityGroup } from '../../../app/security-group/sg.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


@Injectable()
export class MockSecurityGroupTagService {
  public markForRemoval(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return Observable.of(securityGroup);
  }

  public markAsTemplate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return Observable.of(securityGroup);
  }
}
