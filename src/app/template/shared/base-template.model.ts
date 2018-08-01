import { BaseModelInterface, Tag } from '../../shared/models';
import { OsType } from '../../shared/models/os-type.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TemplateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { Utils } from '../../shared/services/utils/utils.service';

export enum TemplateResourceType {
  Iso = 'Iso',
  Template = 'Template'
}

export interface BaseTemplateModel extends BaseModelInterface, Taggable {
  id: string;
  account: string;
  created: Date;
  crossZones: boolean;
  displaytext: string;
  domain: string;
  domainid: string;
  isdynamicallyscalable: boolean;
  isextractable: boolean;
  isfeatured: boolean;
  ispublic: boolean;
  isready: boolean;
  name: string;
  ostypeid: string;
  ostypename: string;
  osType: OsType;
  size: number;
  status: string;
  tags: Array<Tag>;
  zoneid: string;
  zonename: string;
  agreementAccepted?: boolean;

  zones?: Array<Partial<BaseTemplateModel>>;
}

export const downloadUrl = (template: BaseTemplateModel): string => {
  const tag = template.tags.find(_ => _.key === TemplateTagKeys.downloadUrl);

  if (tag) {
    return tag.value;
  }
};

export const sizeInGB = (template: BaseTemplateModel): number => {
  return Utils.convertToGb(template.size);
};

export const isTemplate = (template: BaseTemplateModel): boolean =>
  template && template.bootable !== undefined ? false : true;

export const resourceType = (template: BaseTemplateModel): TemplateResourceType =>
  template && template.bootable !== undefined ? TemplateResourceType.Iso : TemplateResourceType.Template;

export const getPath = (template: BaseTemplateModel) =>
  template && template.bootable !== undefined ? 'iso' : 'template';

