import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MarkForRemovalService } from './common-tags/mark-for-removal.service';
import { SecurityGroup } from '../../../security-group/sg.model';
import { EntityTagService } from './entity-tag.service';
import { TagService } from './tag.service';
import { Utils } from '../utils.service';


type SecurityGroupTagKey = 'template';
const SecurityGroupTagKeys = {
  template: 'template' as SecurityGroupTagKey
};

@Injectable()
export class SecurityGroupTagService extends EntityTagService {
  public entityPrefix = 'security-group';
  public keys = SecurityGroupTagKeys;

  constructor(
    private markForRemovalService: MarkForRemovalService,
    protected tagService: TagService
  ) {
    super(tagService);
    this.initKeys();
  }

  public markForRemoval(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.markForRemovalService.markForRemoval(securityGroup);
  }

  public markAsTemplate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.update(
      securityGroup,
      securityGroup.resourceType,
      this.keys.template,
      Utils.convertBooleanToBooleanString(true)
    );
  }
}
