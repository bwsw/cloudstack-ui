import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IsoService } from '../shared';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';

@Component({
  selector: 'cs-iso-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class IsoSidebarComponent extends BaseTemplateSidebarComponent {
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
