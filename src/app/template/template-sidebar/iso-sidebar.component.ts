import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseTemplateSidebarComponent } from './base-template-sidebar.component';
import { Iso } from '../shared/iso.model';

@Component({
  selector: 'cs-iso-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class IsoSidebarComponent extends BaseTemplateSidebarComponent {
  @Input() public entity: Iso;

  constructor(route: ActivatedRoute) {
    super(route);
  }
}
