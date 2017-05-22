import { BaseTemplateModel } from './base-template.model';


export class Iso extends BaseTemplateModel {
  public path = 'iso';

  public bootable: boolean;
  public checksum: string;
  public size: number;
}
