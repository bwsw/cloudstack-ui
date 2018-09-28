import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SecurityGroupCreationService } from './security-group-creation.service';
import { SecurityGroup } from '../../sg.model';

@Injectable()
export class PrivateSecurityGroupCreationService extends SecurityGroupCreationService {
  protected securityGroupCreationPostAction(
    securityGroup: SecurityGroup
  ): Observable<SecurityGroup> {
    return this.securityGroupTagService.markAsPrivate(securityGroup);
  }
}
