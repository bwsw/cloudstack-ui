import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { TemplateService } from '../../shared/services';
import { Template } from '../../shared/models';
import { PRESELECTED_TEMPLATE_TOKEN } from './injector-token';


@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: './vm-creation-template-dialog.component.html',
  styleUrls: ['./vm-creation-template-dialog.component.scss']
})
export class VmCreationTemplateDialogComponent implements OnInit {
  private loaded: boolean;
  private templates: Array<TemplateObject>;
  private selectedId: string;

  constructor(
    @Inject(PRESELECTED_TEMPLATE_TOKEN) preselectedTemplate: string,
    private dialog: MdlDialogReference,
    private templateService: TemplateService,
    private ref: ChangeDetectorRef
  ) {
    this.loaded = false;

    this.templates = new Array<TemplateObject>();
    this.templates.push(new TemplateObject('Featured', 'featured'));
    this.templates.push(new TemplateObject('Community', 'community'));
    this.templates.push(new TemplateObject('My templates', 'selfexecutable'));
    this.templates.push(new TemplateObject('Shared', 'sharedexecutable'));
  }

  public ngOnInit() {
    let templatePromises = [];
    for (let obj of this.templates) {
      templatePromises.push(this.templateService.getList({templatefilter: obj.templateFilter}));
    }

    Promise.all(templatePromises)
      .then(data => {
        data.forEach((templateSet, i) => {
          this.templates[i].templates = templateSet;
        });
        this.loaded = true;
        this.removeEmptyTemplateObjects();
        this.ref.detectChanges();
      });
  }

  private removeEmptyTemplateObjects() {
    this.templates = this.templates.filter((templateObject) => {
      return templateObject.templates.length > 0;
    });
  }

  private onSelect(id: string) {
    this.selectedId = id;
  }

  private onOk() {
    this.dialog.hide(this.selectedId);
  }
}


class TemplateObject {
  public name;
  public templateFilter: string;
  public templates: Array<Template>;

  constructor (name: string, templateFilter: string) {
    this.name = name;
    this.templateFilter = templateFilter;
  }
}

