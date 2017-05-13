import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IsoService } from '../shared';
import { TemplateSidebarComponent } from './template-sidebar.component';

@Component({
  selector: 'cs-iso-sidebar',
  templateUrl: 'template-sidebar.component.html'
})
export class IsoSidebarComponent extends TemplateSidebarComponent {
  constructor(
    private isoService: IsoService,
    private route: ActivatedRoute
  ) {
    super();
    this.route.params.pluck('id').subscribe((id: string) => {
      if (id) {
        this.isoService.get(id)
          .subscribe(template => this.template = template);
      }
    });
  }
}
