import {
  Component,
  forwardRef,
  HostListener,
  Inject,
  QueryList,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';

import { MdlButtonComponent } from '@angular-mdl/core';

import { IMdlDialogAction, IMdlSimpleDialogConfiguration } from './mdl-dialog-configuration';
import { MDL_CONFIGUARTION, MdlDialogReference } from './mdl-dialog.service';


@Component({
  // tslint:disable-next-line
  selector: 'mdl-dialog-component',
  templateUrl: 'mdl-simple-dialog.component.html',
  encapsulation: ViewEncapsulation.None

})
export class MdlSimpleDialogComponent {
  @ViewChildren(MdlButtonComponent) public buttons: QueryList<MdlButtonComponent>;

  constructor(
    @Inject(forwardRef( () => MDL_CONFIGUARTION)) public dialogConfiguration: IMdlSimpleDialogConfiguration,
    @Inject(forwardRef( () => MdlDialogReference)) public dialog: MdlDialogReference) {

    dialog.onVisible().subscribe(() => {
      if (this.buttons) {
        this.buttons.first.elementRef.nativeElement.focus();
      }
    });
  }

  public actionClicked(action: IMdlDialogAction): void {
    action.handler();
    this.dialog.hide();
  }

  @HostListener('keydown.esc')
  public onEsc(): void {
    const closeAction = this.dialogConfiguration.actions.find(action => action.isClosingAction);
    if (closeAction) {
      closeAction.handler();
      this.dialog.hide();
    }
  }
}
