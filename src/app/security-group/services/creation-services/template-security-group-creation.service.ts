import { Injectable } from '@angular/core';
import { SecurityGroupCreationService } from './security-group-creation.service';
import { Observable } from 'rxjs/Observable';
import { SecurityGroup } from '../../sg.model';


@Injectable()
export class TemplateSecurityGroupCreationService extends SecurityGroupCreationService {
  protected securityGroupCreationPostAction(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.securityGroupTagService.markAsTemplate(securityGroup);
  }
}
