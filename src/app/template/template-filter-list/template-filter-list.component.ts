import { Component } from '@angular/core';
import { templateGroupings } from '../containers/template-page.container';

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent {
  readonly groupings = templateGroupings;
}
