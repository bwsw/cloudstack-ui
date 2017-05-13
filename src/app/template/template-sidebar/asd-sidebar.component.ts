import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../shared';
import { TemplateSidebarComponent } from './template-sidebar.component';

@Component({
  selector: 'cs-asd-sidebar',
  templateUrl: 'template-sidebar.component.html'
})
export class AsdSidebarComponent extends TemplateSidebarComponent {
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
