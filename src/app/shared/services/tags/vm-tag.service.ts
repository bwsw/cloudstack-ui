import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { getInstanceGroupName, VirtualMachine, vmResourceType } from '../../../vm/shared/vm.model';
import { Color, InstanceGroup, Tag } from '../../models';
import { Taggable } from '../../interfaces';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { DescriptionTagService } from './description-tag.service';
import { virtualMachineTagKeys } from './vm-tag-keys';

const colorDelimeter = ';';

@Injectable()
export class VmTagService implements EntityTagService {
  public keys = virtualMachineTagKeys;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService,
  ) {}

  public getColorSync(vm: VirtualMachine): Color {
    const tag = vm.tags && vm.tags.find(_ => _.key === this.keys.color);
    return this.getColorFromColorTag(tag);
  }

  public setColor(vm: VirtualMachine, color: Color): Observable<VirtualMachine> {
    let tagValue = color.value;
    if (color.textColor) {
      tagValue += `${colorDelimeter}${color.textColor}`;
    }
    return this.tagService.update(vm, vmResourceType, this.keys.color, tagValue);
  }

  public setDescription(vm: VirtualMachine, description: string): Observable<VirtualMachine> {
    return this.descriptionTagService.setDescription(
      vm,
      vmResourceType,
      description,
      this,
    ) as Observable<VirtualMachine>;
  }

  public removeDescription(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.descriptionTagService.removeDescription(vm, vmResourceType, this) as Observable<
      VirtualMachine
    >;
  }

  public setPassword(vm: VirtualMachine, password: string): Observable<VirtualMachine> {
    return this.tagService.update(vm, vmResourceType, virtualMachineTagKeys.passwordTag, password);
  }

  public setGroup(vm: VirtualMachine, group: InstanceGroup): Observable<VirtualMachine> {
    return this.tagService.update(vm, vmResourceType, this.keys.group, group && group.name);
  }

  public removeGroup(vm: VirtualMachine): Observable<VirtualMachine> {
    const newVm: VirtualMachine = { ...vm };
    return this.tagService
      .remove({
        resourceIds: vm.id,
        resourceType: vmResourceType,
        'tags[0].key': this.keys.group,
        'tags[0].value': getInstanceGroupName(vm),
      })
      .pipe(
        map(() => {
          newVm.tags = newVm.tags.filter(t => this.keys.group !== t.key);
          return newVm;
        }),
      );
  }

  public setAgreement(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.tagService.update(vm, vmResourceType, this.keys.agreementAccepted, true);
  }

  public copyTagsToEntity(tags: Tag[], entity: Taggable): Observable<any> {
    const copyRequests = tags.map(tag => {
      return this.tagService.update(entity, vmResourceType, tag.key, tag.value);
    });

    if (!copyRequests.length) {
      return of(null);
    }
    // todo
    // tslint:disable-next-line:deprecation
    return forkJoin(...copyRequests);
  }

  private getColorFromColorTag(colorTag: Tag): Color {
    if (colorTag) {
      const [backgroundColor, textColor] = colorTag.value.split(colorDelimeter);
      return new Color(backgroundColor, backgroundColor, textColor || '');
    }
    return new Color('white', '#FFFFFF', '');
  }
}
