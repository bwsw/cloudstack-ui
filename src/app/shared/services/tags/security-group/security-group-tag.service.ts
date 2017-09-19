import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SecurityGroupTagKeys } from './security-group-tag-keys';
import { EntityTagService } from '../common/entity-tag-service.interface';
import { MarkForRemovalService } from '../common/mark-for-removal.service';
import { TagService } from '../common/tag.service';
import { SecurityGroup, SecurityGroupType } from '../../../../security-group/sg.model';


@Injectable()
export class SecurityGroupTagService implements EntityTagService {
  public keys = SecurityGroupTagKeys;

  constructor(
    private markForRemovalService: MarkForRemovalService,
    protected tagService: TagService
  ) {}

  public markForRemoval(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.markForRemovalService.markForRemoval(securityGroup) as Observable<SecurityGroup>;
  }

  public markAsTemplate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.update(
      securityGroup,
      securityGroup.resourceType,
      this.keys.type,
      SecurityGroupType.CustomTemplate
    );
  }

  public markAsPrivate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.update(
      securityGroup,
      securityGroup.resourceType,
      this.keys.type,
      SecurityGroupType.Private
    );
  }
}
