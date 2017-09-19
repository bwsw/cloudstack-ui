import { FieldMapper } from '../../../shared/decorators';
import { Taggable } from '../../../shared/interfaces/taggable.interface';
import { TemplateTagKeys } from '../../../shared/services/tags/template/template/template-tag-keys';
import { BaseTemplateModel } from '../base/base-template.model';


@FieldMapper({
  passwordenabled: 'isPasswordEnabled',
  templatetype: 'type'
})
export class Template extends BaseTemplateModel implements Taggable {
  public resourceType = 'Template';
  public path = 'template';

  public format: string;
  public hypervisor: string;
  public isPasswordEnabled: boolean;
  public status: string;
  public type: string;
  public size: number;

  public get isTemplate(): boolean {
    return true;
  }

  protected get tagKeys(): any {
    return TemplateTagKeys;
  }
}
