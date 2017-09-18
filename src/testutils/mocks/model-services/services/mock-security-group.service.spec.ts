import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup, SecurityGroupType } from '../../../../app/security-group/sg.model';


const securityGroupTemplates: Array<Object> = require('../fixtures/securityGroupTemplates.json');

@Injectable()
export class MockServiceOfferingService {
  public getList(): Observable<Array<SecurityGroup>> {
    return Observable.of(securityGroupTemplates.map(json => new SecurityGroup(json)));
  }
}
