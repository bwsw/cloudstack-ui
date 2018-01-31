import { BaseTemplateModel } from './base-template.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';


export interface Template extends BaseTemplateModel, Taggable {
  format: string;
  hypervisor: string;
  passwordenabled: boolean;
  status: string;
  templatetype: string;
  size: number;
}
