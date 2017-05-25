import { Component, Input } from '@angular/core';
import { MdlTableComponent } from '@angular-mdl/core';


@Component({
  selector: 'cs-table',
  templateUrl: 'table.component.html'
})
export class TableComponent extends MdlTableComponent {
  @Input() public searchQuery: string;
}
