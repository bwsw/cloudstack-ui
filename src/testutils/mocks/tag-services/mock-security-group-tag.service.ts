import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { SecurityGroup } from '../../../app/security-group/sg.model';

@Injectable()
export class MockSecurityGroupTagService {
  public markForRemoval(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return of(securityGroup);
  }

  public markAsTemplate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return of(securityGroup);
  }
}
