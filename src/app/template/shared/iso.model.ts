import { BaseTemplateModel } from './base-template.model';
import { Taggable } from '../../shared/interfaces/taggable.interface';


export class Iso extends BaseTemplateModel implements Taggable {
  public resourceType = 'ISO';
  public path = 'iso';

  public bootable: boolean;
  public checksum: string;
  public size: number;

  public get isTemplate(): boolean {
    return false;
  }
}
