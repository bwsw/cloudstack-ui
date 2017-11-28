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
import { KeyValuePair } from '../../../tags/tags-view/tags-view.component';


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

  public removeDescription(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.descriptionTagService.removeDescription(vm, this) as Observable<VirtualMachine>;
  }

  public setPassword(vm: VirtualMachine, tag: KeyValuePair): Observable<VirtualMachine>  {
    return this.tagService.update(vm, vm.resourceType, tag.key, tag.value);
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

  public removeGroup(vm: VirtualMachine): Observable<VirtualMachine> {
    let newVm = Object.assign({}, vm);
    return this.tagService.remove({
        resourceIds: vm.id,
        resourceType: vm.resourceType,
        'tags[0].key': this.keys.group,
        'tags[0].value': vm.instanceGroup.name
      })
      .map(() => {
        newVm.tags = newVm.tags.filter(t => this.keys.group !== t.key);
        return newVm;
      });
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
