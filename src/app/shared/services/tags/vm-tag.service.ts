import { Injectable } from '@angular/core';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { Color } from '../../models/color.model';
import { Tag } from '../../models/tag.model';
import { InstanceGroup } from '../../models/instance-group.model';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { DescriptionTagService } from './description-tag.service';
import { VirtualMachineTagKeys } from './vm-tag-keys';


@Injectable()
export class VmTagService implements EntityTagService {
  public keys = VirtualMachineTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
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
    return this.tagService.getTag(vm, this.keys.group)
      .map(tag => this.getGroupFromTag(tag));
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return this.tagService.update(
      vm,
      vm.resourceType,
      this.keys.group,
      group && group.name
    );
  }

  public getAgreement(vm: VirtualMachine): Observable<boolean> {
    return Observable.of(
      this.tagService.getValueFromTag(vm.tags.find(tag => tag.key === this.keys.agreementAccepted))
    );
  }

  public setAgreement(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.tagService.update(
      vm,
      vm.resourceType,
      this.keys.agreementAccepted,
      true
    );
  }

  private getColorFromColorTag(colorTag: Tag): Color {
    if (colorTag) {
      const [backgroundColor, textColor] = colorTag.value.split(VirtualMachine.ColorDelimiter);
      return new Color(backgroundColor, backgroundColor, textColor || '');
    }

    return new Color('white', '#FFFFFF', '');

  }

  private getGroupFromTag(groupTag: Tag): InstanceGroup {
    if (groupTag) {
      return new InstanceGroup(groupTag.value);
    }
  }
}
