import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../../../template/shared/base/base-template.model';
import { InstanceGroup } from '../../../../models/instance-group.model';
import { InstanceGroupTagServiceInterface } from '../../common/instance-group-tag-service.interface';
import { InstanceGroupTagService } from '../../common/instance-group-tag.service';
import { TagService } from '../../common/tag.service';


@Injectable()
export abstract class BaseTemplateTagService implements InstanceGroupTagServiceInterface {
  public abstract keys: any;

  constructor(
    protected instanceGroupTagService: InstanceGroupTagService,
    protected tagService: TagService
  ) {}

  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return this.tagService.getTag(template, this.keys.downloadUrl)
      .map(tag => this.tagService.getValueFromTag(tag));
  }

  public setDownloadUrl(template: BaseTemplateModel, downloadUrl: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.downloadUrl,
      downloadUrl
    );
  }

  public getGroup(template: BaseTemplateModel): Observable<InstanceGroup> {
    return this.instanceGroupTagService.getGroup(template, this);
  }

  public setGroup(
    template: BaseTemplateModel,
    group: InstanceGroup
  ): Observable<BaseTemplateModel> {

    return (this.instanceGroupTagService.setGroup(template, group, this) as Observable<BaseTemplateModel>);
  }
}
