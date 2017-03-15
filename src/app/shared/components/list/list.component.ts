import { Component, AfterViewInit } from '@angular/core';
import { ListService } from './list.service';


@Component({
  selector: 'cs-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent implements AfterViewInit {
  public isOpen: boolean;

  constructor(public listService: ListService) {}

  public ngAfterViewInit(): void {
    this.listService.onSelected.subscribe(() => {
      this.isOpen = true;
    });
  }

  public onDetailsHide(): void {
    this.isOpen = false;
    this.listService.onDeselected.next();
  }

  public onAction(): void {
    this.listService.onAction.next();
  }
}
