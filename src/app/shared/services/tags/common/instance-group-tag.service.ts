import { Injectable } from '@angular/core';
import { TagService } from './tag.service';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { Observable } from 'rxjs/Observable';
import { InstanceGroup } from '../../../models/instance-group.model';
import { EntityTagService } from './entity-tag-service.interface';
import { Tag } from '../../../models/tag.model';


@Injectable()
export class InstanceGroupTagService {
  constructor(private tagService: TagService) {}

  public getGroup(entity: InstanceGroupEnabled, entityService: EntityTagService): Observable<InstanceGroup> {
    return this.tagService.getTag(entity, entityService.keys.group)
      .map(tag => this.getGroupFromTag(tag));
  }

  public setGroup(
    entity: InstanceGroupEnabled,
    group: InstanceGroup,
    entityService: EntityTagService
  ): Observable<InstanceGroupEnabled> {
    return this.tagService.update(
      entity,
      entity.resourceType,
      entityService.keys.group,
      group && group.name
    );
  }

  private getGroupFromTag(groupTag: Tag): InstanceGroup {
    if (groupTag) {
      return new InstanceGroup(groupTag.value);
    }
  }
}
