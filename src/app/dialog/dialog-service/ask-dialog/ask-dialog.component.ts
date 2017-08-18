import { Component, HostListener } from '@angular/core';
import { BaseDialogComponent, BaseDialogConfiguration } from '../base-dialog.component';

export interface AskDialogConfiguration extends BaseDialogConfiguration{
  actions: Array<DialogAction>;
  fullWidthAction?: boolean;
}

export interface DialogAction {
  handler?: () => void;
  text: string;
  isClosingAction?: boolean;
}

@Component({
  selector: 'cs-ask-dialog',
  templateUrl: 'ask-dialog.component.html',
  styleUrls: ['ask-dialog.component.scss']
})
export class AskDialogComponent extends BaseDialogComponent<AskDialogComponent> {

  public config: AskDialogConfiguration;

  public actionClicked(action: DialogAction): void {
    action.handler();
    this.dialogRef.close();
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    const closeAction = this.config.actions.find(action => action.isClosingAction);
    if (closeAction) {
      closeAction.handler();
      this.dialogRef.close();
    }
  }
}