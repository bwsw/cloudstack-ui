import * as moment from 'moment';

import { FieldMapper } from '../../shared/decorators/field-mapper.decorator';
import { BaseModel, Tag } from '../../shared/models';
import { OsType } from '../../shared/models/os-type.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { Utils } from '../../shared/services/utils/utils.service';
import { TemplateGroup } from '../../shared/models/template-group.model';
import { DefaultTemplateGroupId } from '../template-sidebar/template-group/template-group.component';


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
export abstract class BaseTemplateModel extends BaseModel implements Taggable {
  public abstract resourceType: string;

  public path: string;

  public id: string;
  public account: string;
  public created: Date;
  public crossZones: boolean;
  public displayText: string;
  public domain: string;
  public domainId: string;
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

  public templateGroup?: TemplateGroup;
  public zones?: Array<Partial<BaseTemplateModel>>;

  constructor(json) {
    super(json);
    this.created = moment(json.created).toDate();
    this.tags = this.tags ? this.tags.map(tag => new Tag(tag)) : [];
    this.size = this.size || 0;

    this.initializeTemplateGroup();
  }

  public abstract get isTemplate(): boolean;

  public get sizeInGB(): number {
    return Utils.convertToGb(this.size);
  }

  public get downloadUrl(): string {
    const tag = this.tags.find(_ => _.key === TemplateTagKeys.downloadUrl);

    if (tag) {
      return tag.value;
    }
  }

  protected initializeTemplateGroup(): void {
    const group = this.tags.find(tag => tag.key === TemplateTagKeys.group);
    this.templateGroup = new TemplateGroup(group ? group.value : DefaultTemplateGroupId);
  }
}
