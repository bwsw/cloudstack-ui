import { BaseModel } from '../../shared/models';
import { OsType } from '../../shared/models/os-type.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { templateTagKeys } from '../../shared/services/tags/template-tag-keys';
import { Utils } from '../../shared/services/utils/utils.service';

export enum TemplateResourceType {
  Iso = 'Iso',
  Template = 'Template',
}

export interface BaseTemplateModel extends BaseModel, Taggable {
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
  zoneid: string;
  zonename: string;
  bootable: boolean;
  // custom
  zones?: Partial<BaseTemplateModel>[];
  agreementAccepted?: boolean;
}

export const isTemplate = (template: BaseTemplateModel): boolean =>
  !(template && template.bootable !== undefined);

export const resourceType = (template: BaseTemplateModel): TemplateResourceType =>
  isTemplate(template) ? TemplateResourceType.Template : TemplateResourceType.Iso;

export const getPath = (template: BaseTemplateModel) => (isTemplate(template) ? 'template' : 'iso');

export const downloadUrl = (template: BaseTemplateModel): string => {
  const tag = template.tags.find(_ => _.key === templateTagKeys.downloadUrl);

  if (tag) {
    return tag.value;
  }
};

export const sizeInGB = (template: BaseTemplateModel): number => {
  return Utils.convertToGb(template.size);
};
