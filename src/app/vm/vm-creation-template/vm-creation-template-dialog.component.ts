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
  private activeTab: number;
  private loaded: boolean;
  private selectedTemplate: Template;
  private templates: Array<TemplateObject>;


  constructor(
    @Inject(PRESELECTED_TEMPLATE_TOKEN) private preselectedTemplate: Template,
    private dialog: MdlDialogReference,
    private templateService: TemplateService,
    private ref: ChangeDetectorRef
  ) {
    this.loaded = false;
    this.selectedTemplate = this.preselectedTemplate;

    this.templates = new Array<TemplateObject>();
    this.templates.push(new TemplateObject('Featured', 'featured'));
    this.templates.push(new TemplateObject('My Templates', 'selfexecutable'));
    this.templates.push(new TemplateObject('Community', 'community'));
    this.templates.push(new TemplateObject('Shared', 'sharedexecutable'));
  }

  public ngOnInit(): void {
    this.templateService.getGroupedTemplates()
      .then(templatesObjects => {
        for (let filter in templatesObjects) {
          if (!templatesObjects.hasOwnProperty(filter)) {
            continue;
          }
          // Trying to find TemplateOblect for this type of templates
          // for (let i = 0; i < this.templates.length; i++) {
          //   if (this.templates[i].templateFilter === filter) {
          //     this.templates[i].templates = templatesObjects[filter];
          //     break;
          //   }
          // }
          const index = this.templates.findIndex((template) => template.templateFilter === filter);
          if (index !== -1) {
            this.templates[index].templates = templatesObjects[filter];
          }
        }
        this.loaded = true;
        this.removeEmptyTemplateObjects();
        this.chooseActiveTab();
        this.ref.detectChanges();
      });
  }

  public onSelect(id: Template): void {
    this.selectedTemplate = id;
  }

  public onOk(): void {
    this.dialog.hide(this.selectedTemplate);
  }

  public onCancel(): void {
    this.dialog.hide(this.preselectedTemplate);
  }

  private removeEmptyTemplateObjects(): void {
    this.templates = this.templates.filter((templateObject) => {
      return templateObject.templates.length > 0;
    });
  }

  private chooseActiveTab(): void {
    for (let i = 0; i < this.templates.length; i++) {
      for (let template of this.templates[i].templates) {
        if (template.id === this.preselectedTemplate.id) {
          this.activeTab = i;
          return;
        }
      }
    }
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

