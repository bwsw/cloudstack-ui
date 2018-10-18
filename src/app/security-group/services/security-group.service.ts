import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Rules } from '../../shared/components/security-group-builder/rules';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendService } from '../../shared/services/base-backend.service';
import { SecurityGroup } from '../sg.model';
import { PrivateSecurityGroupCreationService } from './creation-services/private-security-group-creation.service';
import { SharedSecurityGroupCreationService } from './creation-services/shared-security-group-creation.service';
import { TemplateSecurityGroupCreationService } from './creation-services/template-security-group-creation.service';

export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
})
export class SecurityGroupService extends BaseBackendService<SecurityGroup> {
  constructor(
    protected http: HttpClient,
    private privateSecurityGroupCreation: PrivateSecurityGroupCreationService,
    private sharedSecurityGroupCreation: SharedSecurityGroupCreationService,
    private templateSecurityGroupCreation: TemplateSecurityGroupCreationService,
  ) {
    super(http);
  }

  public createShared(data: any, rules?: Rules): Observable<SecurityGroup> {
    return this.sharedSecurityGroupCreation.createGroup(data, rules);
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    return this.templateSecurityGroupCreation.createGroup(data, rules);
  }

  public createPrivate(data: any, rules?: Rules): Observable<SecurityGroup> {
    return this.privateSecurityGroupCreation.createGroup(data, rules);
  }

  public deleteGroup(securityGroup: SecurityGroup): Observable<any> {
    return this.remove({ id: securityGroup.id }).pipe(
      map(result => {
        if (!result || result.success !== 'true') {
          return throwError(result);
        }
      }),
    );
  }
}
