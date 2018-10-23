import { BaseTemplateModel } from './base-template.model';

export interface Iso extends BaseTemplateModel {
  bootable: boolean;
  checksum: string;
  size: number;
}
