import { BaseTemplateModel } from './base-template.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';


export interface Iso extends BaseTemplateModel, Taggable {
  bootable: boolean;
  checksum: string;
  size: number;
}
