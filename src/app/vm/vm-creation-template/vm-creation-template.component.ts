import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../../shared/services';
import { Template } from '../../shared/models';

@Component({
  selector: 'cs-vm-creation-template',
  templateUrl: './vm-creation-template.component.html',
  styleUrls: ['./vm-creation-template.component.scss']
})
export class VmCreationTemplateComponent implements OnInit {
  private featuredTemplates: Promise<Array<Template>>; // here async draw
  private communityTemplates: Array<Template>;
  private selfExecutableTemplates: Array<Template>;
  private sharedExecutableTemplates: Array<Template>;

  private radioOption: any;
  private templateFilterValues: Array<string>;

  constructor(private templateService: TemplateService) {
    this.templateFilterValues = new Array<string>();
    this.templateFilterValues.push('featured', 'community', 'selfexecutable', 'sharedexecutable');
  }

  public ngOnInit() {
    this.featuredTemplates = this.templateService.getList({templatefilter: 'featured'});
    // this.templateService.getList({templatefilter: 'community'})
    //   .then(data => this.communityTemplates = data);
    // this.templateService.getList({templatefilter: 'selfexecutable'})
    //   .then(data => this.selfExecutableTemplates = data);
    // this.templateService.getList({templatefilter: 'sharedexecutable'})
    //   .then(data => this.sharedExecutableTemplates = data);
  }

  private tabChanged(event: {index: number}) {
    console.log(event);
  }

}


