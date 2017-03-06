import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { Template, TemplateService } from '../../../template/shared';
import { VmTemplateDialogComponent } from './vm-template-dialog.component';
import { PRESELECTED_TEMPLATE_TOKEN, ZONE } from './injector-token';


@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: 'vm-template.component.html',
  styleUrls: ['vm-template.component.scss']
})
export class VmTemplateComponent implements OnInit, OnChanges {
  @Input() public selectedIn: Template;
  @Input() public zoneId: string;
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
      this.templateService.getDefault()
        .subscribe((template: Template) => {
          this.selectedIn = template;
          this.displayTemplateName = this.selectedIn.name;
        });
    }
  }

  public ngOnChanges(): void {
    if (this.selectedIn) {
      this.displayTemplateName = this.selectedIn.name;
    }
  }

  public onClick(): void {
    this.dialogService.showCustomDialog({
      component: VmTemplateDialogComponent,
      classes: 'vm-template-dialog',
      providers: [
        { provide: PRESELECTED_TEMPLATE_TOKEN, useValue: this.selectedIn },
        { provide: ZONE, useValue: this.zoneId }
      ],
    })
      .switchMap(res => res.onHide())
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.selectedOut.emit(data);
        this.displayTemplateName = data.name;
      }, () => {});
  }
}
