import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SecurityGroupCreationService } from './security-group-creation.service';
import { SecurityGroupNative } from '../../sg.model';

@Injectable()
export class TemplateSecurityGroupCreationService extends SecurityGroupCreationService {
  protected securityGroupCreationPostAction(
    securityGroup: SecurityGroupNative,
  ): Observable<SecurityGroupNative> {
    return this.securityGroupTagService.markAsTemplate(securityGroup);
  }
}
