import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { InstanceGroup } from '../../../models/instance-group.model';
import { Tag } from '../../../models/tag.model';
import { EntityTagService } from './entity-tag-service.interface';
import { TagService } from './tag.service';


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

    const requests = this.getTranslationTags(entityService, group)
      .filter(tag => tag.value)
      .map(tag => {
        return this.tagService.update(
          entity,
          entity.resourceType,
          tag.key,
          tag.value
        )
      });

    return Observable.forkJoin(...requests).map(res => res[0]);
  }

  private getGroupFromTag(groupTag: Tag): InstanceGroup {
    if (groupTag) {
      return new InstanceGroup(groupTag.value);
    }
  }

  private getTranslationTags(
    entityService: EntityTagService,
    group: InstanceGroup
  ): Array<{ key: string, value: string }> {

    return [
      {
        key: entityService.keys.group,
        value: group.name
      },
      {
        key: entityService.keys.groupEn,
        value: group.translations && group.translations.en
      },
      {
        key: entityService.keys.groupRu,
        value: group.translations && group.translations.ru
      },
      {
        key: entityService.keys.groupCn,
        value: group.translations && group.translations.cn
      }
    ];
  }
}
