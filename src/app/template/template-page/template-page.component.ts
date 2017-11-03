import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { ListService } from '../../shared/components/list/list.service';
import { OsType } from '../../shared/models/os-type.model';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent implements OnInit {
  @Input() public templates: Array<BaseTemplateModel>;
  @Input() public fetching: boolean;

  @Input() public query: string;
  @Input() public osTypes: Array<OsType>;
  @Input() public viewMode: string;
  @Input() public groupings: object[];

  @Input() public selectedTypes: any[];
  @Input() public selectedAccountIds: Account[];
  @Input() public selectedOsFamilies: any[];
  @Input() public selectedZones: any[];
  @Input() public selectedGroupings: any[];

  @Output() public updateList = new EventEmitter();
  @Output() public onTemplateDelete = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public listService: ListService
  ) {
  }

  public ngOnInit(): void {
    this.listService.onUpdate.subscribe((template) => {
      this.updateList.emit(template);
    });
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }
}
