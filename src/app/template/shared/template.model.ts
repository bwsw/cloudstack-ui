import { BaseTemplateModel } from './base-template.model';

export interface Template extends BaseTemplateModel {
  format: string;
  hypervisor: string;
  passwordenabled: boolean;
  status: string;
  templatetype: string;
  size: number;
}
