import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../../../../vm/shared/vm.model';
import { Color } from '../../../models/color.model';
import { InstanceGroup } from '../../../models/instance-group.model';
import { Tag } from '../../../models/tag.model';
import { DescriptionTagService } from '../common/description-tag.service';
import { InstanceGroupTagServiceInterface } from '../common/instance-group-tag-service.interface';
import { InstanceGroupTagService } from '../common/instance-group-tag.service';
import { TagService } from '../common/tag.service';
import { VirtualMachineTagKeys } from './vm-tag-keys';


@Injectable()
export class VmTagService implements InstanceGroupTagServiceInterface {
  public keys = VirtualMachineTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected instanceGroupTagService: InstanceGroupTagService,
    protected tagService: TagService
  ) {}

  public getColor(vm: VirtualMachine): Observable<Color> {
    return this.tagService.getTag(vm, this.keys.color)
      .map(tag => this.getColorFromColorTag(tag));
  }

  public getColorSync(vm: VirtualMachine): Color {
    const tag = vm.tags.find(_ => _.key === this.keys.color);
    return this.getColorFromColorTag(tag);
  }

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    let tagValue = color.value;
    if (color.textColor) {
      tagValue += `${VirtualMachine.ColorDelimiter}${color.textColor}`;
    }
    return this.tagService.update(
      vm,
      vm.resourceType,
      this.keys.color,
      tagValue
    );
  }

  public getDescription(vm: VirtualMachine): Observable<string> {
    return this.descriptionTagService.getDescription(vm, this);
  }

  public setDescription(vm: VirtualMachine, description: string): Observable<VirtualMachine> {
    return this.descriptionTagService.setDescription(vm, description, this) as Observable<VirtualMachine>;
  }

  public getGroup(vm: VirtualMachine): Observable<InstanceGroup> {
    return this.instanceGroupTagService.getGroup(vm, this);
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return this.instanceGroupTagService.setGroup(vm, group, this) as Observable<VirtualMachine>;
  }

  private getColorFromColorTag(colorTag: Tag): Color {
    if (colorTag) {
      const [backgroundColor, textColor] = colorTag.value.split(VirtualMachine.ColorDelimiter);
      return new Color(backgroundColor, backgroundColor, textColor || '');
    }

    return new Color('white', '#FFFFFF', '');

  }
}
