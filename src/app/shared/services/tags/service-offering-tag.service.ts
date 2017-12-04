import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import {
  ServiceOffering,
  ServiceOfferingGroup,
  ServiceOfferingGroupKey
} from '../../models/service-offering.model';


@Injectable()
export class ServiceOfferingTagService implements EntityTagService {

  public keys = { group: ServiceOfferingGroupKey };

  constructor(protected tagService: TagService) {
  }

  public setGroup(
    serviceOffering: ServiceOffering,
    group: ServiceOfferingGroup
  ): Observable<ServiceOffering> {
    return this.tagService.update(
      serviceOffering,
      serviceOffering.resourceType,
      this.keys.group,
      group && group.id
    );
  }

  public resetGroup(serviceOffering: ServiceOffering): Observable<ServiceOffering> {
    const tag = serviceOffering.tags.find(_ => _.key === this.keys.group);
    return this.tagService.remove({
      resourceIds: tag.resourceId,
      resourceType: tag.resourceType,
      'tags[0].key': tag.key
    });
  }

}
