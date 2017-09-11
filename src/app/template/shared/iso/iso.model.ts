import { Taggable } from '../../../shared/interfaces/taggable.interface';
import { InstanceGroup } from '../../../shared/models/instance-group.model';
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

  protected initializeInstanceGroup(): void {
    const group = this.tags.find(tag => tag.key === IsoTagKeys.group);

    if (group) {
      this.instanceGroup = new InstanceGroup(group.value);
    }
  }
}
