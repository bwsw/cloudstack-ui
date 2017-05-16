import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';

@Component({
  selector: 'cs-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class TemplateSidebarComponent extends BaseTemplateSidebarComponent {
  constructor(
    private templateService: TemplateService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.params.pluck('id').subscribe((id: string) => {
      if (id) {
        this.templateService.get(id)
          .subscribe(template => this.template = template);
      }
    });
  }
}
