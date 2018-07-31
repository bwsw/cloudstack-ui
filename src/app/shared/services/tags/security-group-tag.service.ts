import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MarkForRemovalService } from './mark-for-removal.service';
import { SecurityGroup, SecurityGroupType } from '../../../security-group/sg.model';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { SecurityGroupTagKeys } from './security-group-tag-keys';

@Injectable()
export class SecurityGroupTagService implements EntityTagService {
  public keys = SecurityGroupTagKeys;
  private readonly resourceType = 'SecurityGroup';

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
      this.resourceType,
      this.keys.type,
      SecurityGroupType.CustomTemplate
    );
  }

  public markAsPrivate(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.update(
      securityGroup,
      this.resourceType,
      this.keys.type,
      SecurityGroupType.Private
    );
  }

  public convertToShared(securityGroup: SecurityGroup): Observable<SecurityGroup> {
    return this.tagService.remove({
      resourceIds: securityGroup.id,
      resourceType: this.resourceType,
      'tag[0].key': this.keys.type
    })
      .map(() => {
        const filteredTags = securityGroup.tags.filter(_ => this.keys.type !== _.key);
        return {
          ...securityGroup,
          tags: filteredTags,
          type: 'shared'
        };
      })
  }
}
