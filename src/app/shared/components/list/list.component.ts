import { Component, AfterViewInit, Optional } from '@angular/core';
import { ListService } from './list.service';


@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent implements AfterViewInit {
  public isOpen: boolean;

  constructor(@Optional() public listService: ListService) {}

  public ngAfterViewInit(): void {
    if (this.listService) {
      this.listService.onSelected.subscribe(() => {
        this.isOpen = true;
      });
      this.listService.onDeselected.subscribe(() => {
        this.isOpen = false;
      });
    }
  }

  public onDetailsHide(): void {
    this.listService.onDeselected.next();
  }

  public onAction(): void {
    this.listService.onAction.next();
  }
}
