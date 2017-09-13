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
    return this.removeGroup(entity, entityService)
      .switchMap(() => {
        const requests = this.getInstanceGroupTagCreationRequests(entity, entityService, group);
        return Observable.forkJoin(...requests).map(res => {
          res[0].instanceGroup = group;
          return res[0];
        });
      });
  }

  public removeGroup(
    entity: InstanceGroupEnabled,
    entityService: EntityTagService
  ): Observable<InstanceGroupEnabled> {
    const removedTags = this.getInstanceGroupTagRemovalData(entity, entityService);
    const requests = this.getInstanceGroupTagRemovalRequests(entity, removedTags);

    if (!requests.length) {
      return Observable.of(entity);
    }

    return Observable.forkJoin(...requests)
      .map(() => {
        entity.instanceGroup = undefined;
        return entity;
      });
  }

  private getGroupFromTag(groupTag: Tag): InstanceGroup {
    if (groupTag) {
      return new InstanceGroup(groupTag.value);
    }
  }

  private getInstanceGroupTagCreationData(
    entityService: EntityTagService,
    group: InstanceGroup
  ): Array<{ key: string, value: string }> {
    const nameTag = {
      key: entityService.keys.group,
      value: group.name
    };

    const translationTags = [
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
    ]
      .filter(tag => tag.value);

    return [nameTag].concat(translationTags);
  }

  private getInstanceGroupTagRemovalData(
    entity: InstanceGroupEnabled,
    entityService: EntityTagService,
  ): Array<string> {
    return [
      entityService.keys.group,
      entityService.keys.groupEn,
      entityService.keys.groupRu,
      entityService.keys.groupCn
    ]
      .map(key => {
        const tag = entity.tags.find(_ => _.key === key);
        return tag && tag.key;
      })
      .filter(_ => _);
  }

  private getInstanceGroupTagCreationRequests(
    entity: InstanceGroupEnabled,
    entityService: EntityTagService,
    group: InstanceGroup
  ): Array<Observable<InstanceGroupEnabled>> {
    return this.getInstanceGroupTagCreationData(entityService, group)
      .map(tag => {
        return this.tagService.update(
          entity,
          entity.resourceType,
          tag.key,
          tag.value
        );
      });
  }

  private getInstanceGroupTagRemovalRequests(
    entity: InstanceGroupEnabled,
    removedTags: Array<string>
  ): Array<Observable<InstanceGroupEnabled>> {
    return removedTags
      .map(key => {
        return this.tagService.remove({
          resourceIds: entity.id,
          resourceType: entity.resourceType,
          'tags[0].key': key
        });
      });
  }
}
