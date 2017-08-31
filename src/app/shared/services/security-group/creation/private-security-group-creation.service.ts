import { Injectable } from '@angular/core';
import { SecurityGroupCreationService } from './security-group-creation.service';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup } from '../../../../security-group/sg.model';


@Injectable()
export class PrivateSecurityGroupCreationService extends SecurityGroupCreationService {
  protected securityGroupCreationPostAction(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupTagService.markAsPrivate(securityGroup);
  }
}
