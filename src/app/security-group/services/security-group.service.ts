import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Rules } from '../../shared/components/security-group-builder/rules';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { ConfigService } from '../../shared/services/config.service';
import { SecurityGroupTagKeys } from '../../shared/services/tags/security-group-tag-keys';
import { SecurityGroupTagService } from '../../shared/services/tags/security-group-tag.service';
import { SecurityGroup, SecurityGroupType } from '../sg.model';
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

  public getPredefinedTemplates(): Array<SecurityGroup> {
    return this.configService
      .get('securityGroupTemplates')
      .map(group => new SecurityGroup(group));
  }

  public getCustomTemplates(): Observable<Array<SecurityGroup>> {
    return this.getList({
      'tags[0].key': SecurityGroupTagKeys.type,
      'tags[0].value': SecurityGroupType.CustomTemplate
    });
  }

  public getPrivateGroups(): Observable<Array<SecurityGroup>> {
    return this.getList({
      'tags[0].key': SecurityGroupTagKeys.type,
      'tags[0].value': SecurityGroupType.Private
    });
  }

  public getSharedGroups(): Observable<Array<SecurityGroup>> {
    return this.getList()
      .map(sharedGroups => {
        return sharedGroups.filter(group => {
          return group.type === SecurityGroupType.Shared;
        });
      });
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
