import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { VmCreationTemplateDialogComponent } from './vm-creation-template-dialog.component';
import { PRESELECTED_TEMPLATE_TOKEN } from './injector-token';
import { Template } from '../../shared/models';
import { TemplateService } from '../../shared/services/template.service';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-creation-template.component.html',
  styleUrls: ['./vm-creation-template.component.scss']
})
export class VmCreationTemplateComponent implements OnInit, OnChanges {
  @Input() public selectedIn: Template;
  @Output() public selectedOut: EventEmitter<Template>;
  private displayTemplateName: string;

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

  public ngOnChanges(changes: SimpleChanges) {
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
      component: VmCreationTemplateDialogComponent,
      providers: [{provide: PRESELECTED_TEMPLATE_TOKEN, useValue: this.selectedIn}],
      isModal: true,
      styles: {'width': '568px', 'padding': '0.9em' }
    });
    templateDialog.switchMap(res => res.onHide())
      .subscribe((data: any) => {
        this.selectedOut.emit(data);
        this.displayTemplateName = data.name;
      });
  }
}
