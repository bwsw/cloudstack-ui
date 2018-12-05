import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { VirtualMachine, vmResourceType } from '../../../vm/shared/vm.model';
import { Color, Tag } from '../../models';
import { Taggable } from '../../interfaces';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { DescriptionTagService } from './description-tag.service';
import { virtualMachineTagKeys } from './vm-tag-keys';
import { select, Store } from '@ngrx/store';
import * as configSelectors from '../../../root-store/config/config.selectors';
import { State } from '../../../root-store';

const colorDelimeter = ';';

@Injectable()
export class VmTagService implements EntityTagService {
  public keys = virtualMachineTagKeys;
  public enableColors: boolean;

  constructor(
    protected descriptionTagService: DescriptionTagService,
    protected tagService: TagService,
    private store: Store<State>,
  ) {
    this.store.pipe(select(configSelectors.get('vmColors'))).subscribe(colors => {
      this.enableColors = colors.length !== 0;
    });
  }

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
    if (this.enableColors && colorTag) {
      const [backgroundColor, textColor] = colorTag.value.split(colorDelimeter);
      return new Color(backgroundColor, backgroundColor, textColor || '');
    }
    return new Color('white', '#FFFFFF', '');
  }
}
