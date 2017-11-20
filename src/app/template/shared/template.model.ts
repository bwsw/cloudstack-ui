import { FieldMapper } from '../../shared/decorators/';
import { BaseTemplateModel } from './base-template.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';
import { TemplateResourceType } from './base-template.service';


@FieldMapper({
  passwordenabled: 'isPasswordEnabled',
  templatetype: 'type'
})
export class Template extends BaseTemplateModel implements Taggable {
  public resourceType = TemplateResourceType.template;
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
}
