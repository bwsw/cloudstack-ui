import { BaseTemplateModel } from './base-template.model';


export class Iso extends BaseTemplateModel {
  public bootable: boolean;
  public checksum: string;
  public size: number;
}
