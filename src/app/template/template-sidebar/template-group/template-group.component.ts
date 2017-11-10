import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { TemplateGroupSelectorComponent } from './template-group-selector/template-group-selector.component';
import { TemplateGroupService } from '../../../shared/services/template-group.service';

export const DefaultTemplateGroupId = 'general';

@Component({
  selector: 'cs-template-group',
  templateUrl: 'template-group.component.html',
  styleUrls: ['template-group.component.scss']
})
export class TemplateGroupComponent implements OnInit {
  @Input() public template: BaseTemplateModel;

  constructor(
    private dialog: MatDialog,
    private templateGroupService: TemplateGroupService
  ) {
  }

  public get groupName(): string {
    return this.template.templateGroup
      && this.template.templateGroup.id;
  }

  public get isInDefaultGroup(): boolean {
    return this.template.templateGroup
      && this.template.templateGroup.id === DefaultTemplateGroupId;
  }

  public ngOnInit() {
  }

  public changeGroup(): void {
    this.dialog.open(TemplateGroupSelectorComponent, {
      width: '380px',
      data: this.template
    });
  }

  private addToDefaultGroup() {
    this.templateGroupService.add(this.template, { id: DefaultTemplateGroupId })
      .subscribe();
  }
}
