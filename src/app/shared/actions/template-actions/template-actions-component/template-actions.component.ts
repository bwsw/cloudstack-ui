import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { IsoActionsService } from '../iso-actions.service';
import { TemplateActionsService } from '../template-actions.service';
import { BaseTemplateAction } from '../base-template-action';
import { TemplateDeleteAction } from '../delete/template-delete';
import { IsoDeleteAction } from '../delete/iso-delete';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';


@Component({
  selector: 'cs-template-actions',
  templateUrl: 'template-actions.component.html'
})
export class TemplateActionsComponent implements OnInit {
  @Input() public template: BaseTemplateModel;
  @Output() public deleteTemplate = new EventEmitter<BaseTemplateModel>();
  public actions: Array<BaseTemplateAction>;

  constructor(private templateActionsService: TemplateActionsService,
              private isoActionsService: IsoActionsService,
              private dialogService: DialogService) {
  }

  public ngOnInit(): void {
    if (this.template.isTemplate) {
      this.actions = this.templateActionsService.actions;
    } else {
      this.actions = this.isoActionsService.actions;
    }
  }

  public activateAction(action) {
    this.dialogService.confirm({ message: action.confirmMessage })
      .onErrorResumeNext()
      .subscribe(() => {
        switch (action.icon) {
          case 'delete': {
            this.deleteTemplate.emit(this.template);
          }
        }
      });
  }
}
