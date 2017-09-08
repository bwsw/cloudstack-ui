import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MarkForRemovalService } from '../common/mark-for-removal.service';
import { SecurityGroup } from '../../../../security-group/sg.model';
import { TagService } from '../common/tag.service';
import { Utils } from '../../utils.service';
import { EntityTagService } from '../common/entity-tag-service.interface';
import { SecurityGroupTagKeys } from './security-group-tag-keys';


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
      this.keys.template,
      Utils.convertBooleanToBooleanString(true)
    );
  }
}
