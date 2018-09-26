import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SecurityGroup } from '../../../../app/security-group/sg.model';

const securityGroupTemplates: Array<SecurityGroup> = require('../fixtures/securityGroupTemplates.json');

@Injectable()
export class MockSecurityGroupService {
  public getList(): Observable<Array<SecurityGroup>> {
    return of(securityGroupTemplates);
  }
}
