import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Rules } from '../sg-creation/sg-creation.component';
import { SecurityGroup } from '../sg.model';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { ConfigService } from '../../shared/services/config.service';
import { SecurityGroupTagService } from '../../shared/services/tags/security-group-tag.service';
import { PrivateSecurityGroupCreationService } from './creation-services/private-security-group-creation.service';
import { SharedSecurityGroupCreationService } from './creation-services/shared-security-group-creation.service';
import { TemplateSecurityGroupCreationService } from './creation-services/template-security-group-creation.service';


export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
  public onSecurityGroupCreated = new Subject<SecurityGroup>();
  public onSecurityGroupDeleted = new Subject<SecurityGroup>();
  public onSecurityGroupUpdate = new Subject<SecurityGroup>();

  constructor(
    private configService: ConfigService,
    private privateSecurityGroupCreation: PrivateSecurityGroupCreationService,
    private securityGroupTagService: SecurityGroupTagService,
    private sharedSecurityGroupCreation: SharedSecurityGroupCreationService,
    private templateSecurityGroupCreation: TemplateSecurityGroupCreationService
  ) {
    super();
  }

  public getTemplates(): Array<SecurityGroup> {
    return this.configService
      .get('securityGroupTemplates')
      .map(group => new SecurityGroup(group));
  }

  public createShared(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.sharedSecurityGroupCreation.createGroup(data, rules)
      .do(securityGroup => this.onSecurityGroupCreated.next(securityGroup));
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.templateSecurityGroupCreation.createGroup(data, rules)
      .do(securityGroup => this.onSecurityGroupCreated.next(securityGroup));
  }

  public createPrivate(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.privateSecurityGroupCreation.createGroup(data, rules)
      .do(securityGroup => this.onSecurityGroupCreated.next(securityGroup));
  }

  public deleteGroup(securityGroup: SecurityGroup): Observable<any> {
    this.invalidateCache();
    return this.remove({ id: securityGroup.id })
      .map(result => {
        if (result && result.success === 'true') {
          this.onSecurityGroupDeleted.next(securityGroup);
        } else {
          return Observable.throw(result);
        }
      });
  }

  public markForRemoval(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupTagService.markForRemoval(securityGroup);
  }
}
