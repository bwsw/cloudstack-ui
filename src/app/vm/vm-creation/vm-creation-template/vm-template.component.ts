import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { Template, TemplateService } from '../../../template/shared';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';
import { PRESELECTED_TEMPLATE_TOKEN } from './injector-token';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-template.component.html',
  styleUrls: ['vm-template.component.scss']
})
export class VmTemplateComponent implements OnInit, OnChanges {
  @Input() public selectedIn: Template;
  @Output() public selectedOut: EventEmitter<Template>;
  public displayTemplateName: string;

  constructor(
    private dialogService: MdlDialogService,
    private templateService: TemplateService
  ) {
    this.selectedOut = new EventEmitter<Template>();
  }

  public ngOnInit(): void {
    if (this.selectedIn) {
      this.displayTemplateName = this.selectedIn.name;
    } else {
      this.templateService.getDefault().subscribe(template => {
        this.selectedIn = template;
        this.displayTemplateName = this.selectedIn.name;
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (!changes.hasOwnProperty(propName)) {
        continue;
      }
      if (propName !== 'selectedIn') {
        continue;
      }
      let currentValue = changes[propName].currentValue;
      if (currentValue) {
        this.selectedIn = currentValue;
        this.displayTemplateName = this.selectedIn.name;
      }
    }
  }

  public onClick(): void {
    let templateDialog = this.dialogService.showCustomDialog({
      component: VmTemplateDialogComponent,
      providers: [{provide: PRESELECTED_TEMPLATE_TOKEN, useValue: this.selectedIn}],
      isModal: true,
      styles: {
        'width': '750px',
        'height': '680px'
      },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    });

    templateDialog.switchMap(res => res.onHide())
      .subscribe((data: any) => {
        this.selectedOut.emit(data);
        this.displayTemplateName = data.name;
      });
  }
}
