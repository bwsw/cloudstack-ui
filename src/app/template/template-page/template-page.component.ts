import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseTemplateModel } from '../shared/base-template.model';
import { ListService } from '../../shared/components/list/list.service';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';

@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService],
})
export class TemplatePageComponent implements OnInit {
  @Input()
  public templates: BaseTemplateModel[];
  @Input()
  public fetching: boolean;

  @Input()
  public query: string;
  @Input()
  public viewMode: string;
  @Input()
  public groupings: object[];

  public mode: ViewMode;
  public viewModeKey = 'templatePageViewMode';

  @Output()
  public updateList = new EventEmitter();
  @Output()
  public templateDeleted = new EventEmitter();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public listService: ListService,
  ) {}

  public ngOnInit(): void {
    this.listService.onUpdate.subscribe(template => {
      this.updateList.emit(template);
    });
  }

  public showCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute,
    });
  }

  public changeMode(mode) {
    this.mode = mode;
  }
}
