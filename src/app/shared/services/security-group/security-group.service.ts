import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import { NetworkRuleType, SecurityGroup } from '../../../security-group/sg.model';
import { BackendResource } from '../../decorators';
import { AsyncJobService } from '../async-job.service';
import { BaseBackendCachedService } from '../base-backend-cached.service';
import { ConfigService } from '../config.service';
import { SecurityGroupTagService } from '../tags/security-group-tag.service';
import { NetworkProtocol, NetworkRule } from '../../../security-group/network-rule.model';
import { Subject } from 'rxjs/Subject';
import { NetworkRuleService } from './network-rule.service';
import { PrivateSecurityGroupCreationService } from './creation/private-security-group-creation.service';
import { TemplateSecurityGroupCreationService } from './creation/template-security-group-creation.service';
import { SharedSecurityGroupCreationService } from './creation/shared-security-group-creation.service';


export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
  public onSecurityGroupDeleted = new Subject<SecurityGroup>();

  constructor(
    private configService: ConfigService,
    private networkRuleService: NetworkRuleService,
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
    return this.sharedSecurityGroupCreation.createTemplate(data, rules);
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    return this.templateSecurityGroupCreation.createTemplate(data, rules);
  }

  public createPrivate(data: any, rules?: Rules): Observable<SecurityGroup> {
    return this.privateSecurityGroupCreation.createTemplate(data, rules);
  }

  public deleteTemplate(securityGroup: SecurityGroup): Observable<any> {
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
