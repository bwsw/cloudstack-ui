import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { InstanceGroupEnabledService } from '../../../interfaces/instance-group-enabled-service';
import {
  InstanceGroupSelectorComponent,
  InstanceGroupSelectorData
} from '../instance-group-selector/instance-group-selector.component';
import { Language } from '../../../services/language.service';
import { InstanceGroupTranslationService } from '../../../services/instance-group-translation.service';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss']
})
export class InstanceGroupComponent {
  @Input() public entity: InstanceGroupEnabled;
  @Input() public entityService: InstanceGroupEnabledService;

  constructor(
    private dialog: MdDialog,
    private instanceGroupTranslationService: InstanceGroupTranslationService
  ) {}

  public get groupName(): string {
    return this.instanceGroupTranslationService.getGroupName(this.entity.instanceGroup);
  }

  public changeGroup(): void {
    this.dialog.open(InstanceGroupSelectorComponent, {
      width: '350px',
      data: this.instanceGroupSelectorParams
    });
  }

  private get instanceGroupSelectorParams(): InstanceGroupSelectorData {
    return {
      entity: this.entity,
      entityService: this.entityService
    };
  }
}
