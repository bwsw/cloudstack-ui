import { Taggable } from '../../../shared/interfaces/taggable.interface';
import { IsoTagKeys } from '../../../shared/services/tags/template/iso/iso-tag-keys';
import { BaseTemplateModel } from '../base/base-template.model';


export class Iso extends BaseTemplateModel implements Taggable {
  public resourceType = 'ISO';
  public path = 'iso';

  public bootable: boolean;
  public checksum: string;
  public size: number;

  public get isTemplate(): boolean {
    return false;
  }

  protected get tagKeys(): any {
    return IsoTagKeys;
  }
}
