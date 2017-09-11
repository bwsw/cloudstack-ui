import * as moment from 'moment';

import { FieldMapper } from '../../../shared/decorators/field-mapper.decorator';
import { InstanceGroupEnabled } from '../../../shared/interfaces/instance-group-enabled';
import { Taggable } from '../../../shared/interfaces/taggable.interface';
import { BaseModel, Tag } from '../../../shared/models';
import { InstanceGroup } from '../../../shared/models/instance-group.model';
import { OsType } from '../../../shared/models/os-type.model';
import { TemplateTagKeys } from '../../../shared/services/tags/template/template/template-tag-keys';
import { Utils } from '../../../shared/services/utils.service';
import { TemplateInstanceGroup } from '../../../shared/services/tags/template/base/template-instance-group';


@FieldMapper({
  displaytext: 'displayText',
  domainid: 'domainId',
  isdynamicallyscalable: 'isDynamicallyScalable',
  isextractable: 'isExtractable',
  isfeatured: 'isFeatured',
  ispublic: 'isPublic',
  isready: 'isReady',
  ostypeid: 'osTypeId',
  ostypename: 'osTypeName',
  zoneid: 'zoneId',
  zonename: 'zoneName',
})
export abstract class BaseTemplateModel extends BaseModel implements Taggable, InstanceGroupEnabled {
  public abstract resourceType: string;

  public path: string;

  public id: string;
  public account: string;
  public created: Date;
  public crossZones: boolean;
  public displayText: string;
  public domain: string;
  public domainId: string;
  public instanceGroup: TemplateInstanceGroup;
  public isDynamicallyScalable: boolean;
  public isExtractable: boolean;
  public isFeatured: boolean;
  public isPublic: boolean;
  public isReady: boolean;
  public name: string;
  public osTypeId: string;
  public osTypeName: string;
  public osType: OsType;
  public size: number;
  public status: string;
  public tags: Array<Tag>;
  public zoneId: string;
  public zoneName: string;

  public zones?: Array<Partial<BaseTemplateModel>>;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
    this.tags = this.tags ? this.tags.map(tag => new Tag(tag)) : [];
    this.size = this.size || 0;

    this.initializeInstanceGroup();
  }

  public abstract get isTemplate(): boolean;

  public get sizeInGB(): number {
    return Utils.convertToGB(this.size);
  }

  public get downloadUrl(): string {
    const tag = this.tags.find(_ => _.key === TemplateTagKeys.downloadUrl);

    if (tag) {
      return tag.value;
    }
  }

  private initializeInstanceGroup(): void {
    const group = this.tags.find(tag => tag.key === this.tagKeys.group);
    const groupEn = this.tags.find(tag => tag.key === this.tagKeys.groupEn);
    const groupRu = this.tags.find(tag => tag.key === this.tagKeys.groupRu);
    const groupCn = this.tags.find(tag => tag.key === this.tagKeys.groupCn);

    if (group) {
      this.instanceGroup = {
        name: group.value,
        en: groupEn && groupEn.value,
        ru: groupRu && groupRu.value,
        cn: groupCn && groupCn.value
      };
    }
  }

  protected abstract get tagKeys(): any;
}
