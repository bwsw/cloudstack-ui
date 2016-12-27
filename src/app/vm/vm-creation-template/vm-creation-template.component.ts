import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MdlDialogService, MdlDialogReference } from 'angular2-mdl';
import { VmCreationTemplateDialogComponent } from './vm-creation-template-dialog.component';
import { PRESELECTED_TEMPLATE_TOKEN } from './injector-token';

@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-creation-template.component.html'
})
export class VmCreationTemplateComponent {
  @Input() public preSelected: string;
  @Output() public selected: EventEmitter<string>;

  constructor(private dialogService: MdlDialogService) {
    this.selected = new EventEmitter<string>();
  }

  private onClick () {
    let pDialog = this.dialogService.showCustomDialog({
      component: VmCreationTemplateDialogComponent,
      providers: [{provide: PRESELECTED_TEMPLATE_TOKEN, useValue: this.preSelected}],
      isModal: true,
      styles: {'width': '528px', 'padding': '0.9em' }, // 500 - width of component; ~ 14*2 - left and right paddings

    });
    pDialog.subscribe( (dialogReference: MdlDialogReference) => {
      console.log('dialog visible', dialogReference);
      let a = dialogReference.onHide();
      a.subscribe(d => console.log(d));
    });
  }
}
