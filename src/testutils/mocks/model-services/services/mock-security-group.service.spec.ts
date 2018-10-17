import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SecurityGroup } from '../../../../app/security-group/sg.model';

const securityGroupTemplates: SecurityGroup[] = require('../fixtures/securityGroupTemplates.json');

@Injectable()
export class MockSecurityGroupService {
  public getList(): Observable<SecurityGroup[]> {
    return of(securityGroupTemplates);
  }
}
