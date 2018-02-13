import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Rules } from '../../shared/components/security-group-builder/rules';
import { BackendResource } from '../../shared/decorators';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { ConfigService } from '../../shared/services/config.service';
import { SecurityGroupTagService } from '../../shared/services/tags/security-group-tag.service';
import { getType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { PrivateSecurityGroupCreationService } from './creation-services/private-security-group-creation.service';
import { SharedSecurityGroupCreationService } from './creation-services/shared-security-group-creation.service';
import { TemplateSecurityGroupCreationService } from './creation-services/template-security-group-creation.service';
import { HttpClient } from '@angular/common/http';


export const GROUP_POSTFIX = '-cs-sg';

@Injectable()
@BackendResource({
  entity: 'SecurityGroup',
  entityModel: SecurityGroup
})
export class SecurityGroupService extends BaseBackendCachedService<SecurityGroup> {
  constructor(
    protected http: HttpClient,
    private configService: ConfigService,
    private privateSecurityGroupCreation: PrivateSecurityGroupCreationService,
    private securityGroupTagService: SecurityGroupTagService,
    private sharedSecurityGroupCreation: SharedSecurityGroupCreationService,
    private templateSecurityGroupCreation: TemplateSecurityGroupCreationService
  ) {
    super(http);
  }

  public getPredefinedTemplates(): Array<SecurityGroup> {
    return this.configService
      .get('securityGroupTemplates')
      .map(group => new SecurityGroup(group));
  }

  public getSharedGroups(): Observable<Array<SecurityGroup>> {
    return this.getList()
      .map(sharedGroups => {
        return sharedGroups.filter(group => {
          return getType(group) === SecurityGroupType.Shared;
        });
      });
  }

  public createShared(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.sharedSecurityGroupCreation.createGroup(data, rules);
  }

  public createTemplate(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.templateSecurityGroupCreation.createGroup(data, rules);
  }

  public createPrivate(data: any, rules?: Rules): Observable<SecurityGroup> {
    this.invalidateCache();
    return this.privateSecurityGroupCreation.createGroup(data, rules);
  }

  public deleteGroup(securityGroup: SecurityGroup): Observable<any> {
    this.invalidateCache();
    return this.remove({ id: securityGroup.id })
      .map(result => {
        if (!result || result.success !== 'true') {
          return Observable.throw(result);
        }
      });
  }

  public markForRemoval(securityGroup: SecurityGroup): Observable<any> {
    return this.securityGroupTagService.markForRemoval(securityGroup);
  }
}
