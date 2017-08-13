import { Component, Optional } from '@angular/core';
import { ListService } from './list.service';


@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent {
  constructor(@Optional() public listService: ListService) {}

  public onAction(): void {
    this.listService.onAction.next();
  }
}
