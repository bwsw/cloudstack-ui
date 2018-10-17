import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getInstanceGroupName, VirtualMachine, VmResourceType } from '../../../vm/shared/vm.model';
import { Color, InstanceGroup, Tag } from '../../models';
import { Taggable } from '../../interfaces';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { DescriptionTagService } from './description-tag.service';
import { VirtualMachineTagKeys } from './vm-tag-keys';

const ColorDelimeter = ';';

@Injectable()
export class VmTagService implements EntityTagService {
  public keys = VirtualMachineTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService
  ) {
  }

  public getColorSync(vm: VirtualMachine): Color {
    const tag = vm.tags && vm.tags.find(_ => _.key === this.keys.color);
    return this.getColorFromColorTag(tag);
  }

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    let tagValue = color.value;
    if (color.textColor) {
      tagValue += `${ColorDelimeter}${color.textColor}`;
    }
    return this.tagService.update(
      vm,
      VmResourceType,
      this.keys.color,
      tagValue
    );
  }

  public setDescription(
    vm: VirtualMachine,
    description: string
  ): Observable<VirtualMachine> {
    return this.descriptionTagService.setDescription(
      vm,
      VmResourceType,
      description,
      this
    ) as Observable<VirtualMachine>;
  }

  public removeDescription(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.descriptionTagService.removeDescription(
      vm,
      VmResourceType,
      this
    ) as Observable<VirtualMachine>;
  }

  public setPassword(vm: VirtualMachine, password: string): Observable<VirtualMachine> {
    return this.tagService.update(vm, VmResourceType, VirtualMachineTagKeys.passwordTag, password);
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return this.tagService.update(
      vm,
      VmResourceType,
      this.keys.group,
      group && group.name
    );
  }

  public removeGroup(vm: VirtualMachine): Observable<VirtualMachine> {
    const newVm = Object.assign({}, vm);
    return this.tagService.remove({
      resourceIds: vm.id,
      resourceType: VmResourceType,
      'tags[0].key': this.keys.group,
      'tags[0].value': getInstanceGroupName(vm)
    }).pipe(
      map(() => {
        newVm.tags = newVm.tags.filter(t => this.keys.group !== t.key);
        return newVm;
      }));
  }

  public setAgreement(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.tagService.update(
      vm,
      VmResourceType,
      this.keys.agreementAccepted,
      true
    );
  }


  public copyTagsToEntity(tags: Array<Tag>, entity: Taggable): Observable<any> {
    const copyRequests = tags.map(tag => {
      return this.tagService.update(
        entity,
        VmResourceType,
        tag.key,
        tag.value
      );
    });

    if (!copyRequests.length) {
      return of(null);
    } else {
      return forkJoin(...copyRequests);
    }
  }

  private getColorFromColorTag(colorTag: Tag): Color {
    if (colorTag) {
      const [backgroundColor, textColor] = colorTag.value.split(ColorDelimeter);
      return new Color(backgroundColor, backgroundColor, textColor || '');
    }
    return new Color('white', '#FFFFFF', '');
  }
}
