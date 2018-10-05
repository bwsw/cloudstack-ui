import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MarkForRemovalService } from './mark-for-removal.service';
import { SecurityGroup, SecurityGroupNative, SecurityGroupType } from '../../../security-group/sg.model';
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
  ) {
  }

  public markForRemoval(securityGroup: SecurityGroupNative): Observable<SecurityGroupNative> {
    return this.markForRemovalService.markForRemoval(securityGroup);
  }

  public markAsTemplate(securityGroup: SecurityGroupNative): Observable<SecurityGroupNative> {
    return this.tagService.update(
      securityGroup,
      this.resourceType,
      this.keys.type,
      SecurityGroupType.CustomTemplate
    );
  }

  public markAsPrivate(securityGroup: SecurityGroupNative): Observable<SecurityGroupNative> {
    return this.tagService.update(
      securityGroup,
      this.resourceType,
      this.keys.type,
      SecurityGroupType.Private
    );
  }

  public convertToShared(securityGroup: SecurityGroupNative): Observable<SecurityGroupNative> {
    return this.tagService.remove({
      resourceIds: securityGroup.id,
      resourceType: this.resourceType,
      'tags[0].key': this.keys.type
    }).pipe(
      map(() => {
        const filteredTags = securityGroup.tags.filter(_ => this.keys.type !== _.key);
        return {
          ...securityGroup,
          tags: filteredTags,
        };
      })
    );
  }
}
