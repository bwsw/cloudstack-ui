import { Component, Input, OnInit, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { VirtualMachine } from '../shared/vm.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { Grouping, OsType, Volume } from '../../shared/models';
import { NgrxEntities } from '../../shared/interfaces';
import { State, UserTagsActions, UserTagsSelectors } from '../../root-store';


@Component({
  selector: 'cs-vm-page',
  templateUrl: 'vm-page.component.html',
  styleUrls: ['vm-page.component.scss'],
  providers: [ListService]
})
export class VmPageComponent implements OnInit {
  @Input() public vms: Array<VirtualMachine>;
  @Input() public query: string;
  @Input() public volumes: Array<Volume>;
  @Input() public osTypesMap: NgrxEntities<OsType>;
  @Input() public isLoading: boolean;
  @Input() public groupings: Array<Grouping>;
  @Input() public selectedGroupings: Array<Grouping>;

  public mode: ViewMode;
  public viewModeKey = 'vmPageViewMode';

  constructor(
    public listService: ListService,
    private dialogService: DialogService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<State>
  ) {
  }

  public ngOnInit(): void {
    if (this.vms.length && this.shouldShowSuggestionDialog) {
      this.showSuggestionDialog();
    }
  }

  public changeMode(mode) {
    this.mode = mode;
  }

  public showVmCreationDialog(): void {
    this.router.navigate(['./create'], {
      queryParamsHandling: 'preserve',
      relativeTo: this.activatedRoute
    });
  }

  private get shouldShowSuggestionDialog(): boolean {
    return !this.vms.length && !this.isCreateVmInUrl;
  }

  private get isCreateVmInUrl(): boolean {
    return (
      this.activatedRoute.children.length &&
      this.activatedRoute.children[0].snapshot.url[0].path === 'create'
    );
  }

  private showSuggestionDialog(): void {
    this.store.select(UserTagsSelectors.getIsAskToCreateVM)
      .first()
      .filter(Boolean)
      .subscribe(tag => {
        this.dialogService.askDialog({
          message: 'SUGGESTION_DIALOG.WOULD_YOU_LIKE_TO_CREATE_VM',
          actions: [
            {
              handler: () => this.showVmCreationDialog(),
              text: 'COMMON.YES'
            },
            {
              text: 'COMMON.NO'
            },
            {
              handler: () => {
                this.store.dispatch(new UserTagsActions.UpdateAskToCreateVM({ value: false }));
              },
              text: 'SUGGESTION_DIALOG.NO_DONT_ASK'
            }
          ],
          disableClose: false,
          width: '320px'
        });
      });
  }

}
