import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { delay, filter, first, map, mergeMap } from 'rxjs/operators';

import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { ListService } from '../../shared/components/list/list.service';
import { VirtualMachine } from '../shared/vm.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { Grouping, OsType, Volume } from '../../shared/models';
import { NgrxEntities } from '../../shared/interfaces';
import { State, UserTagsActions, UserTagsSelectors } from '../../root-store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';


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
    this.shouldShowSuggestionDialog.pipe(
      filter(Boolean),
      // This delay is needed as a workaround for https://github.com/angular/angular/issues/15634
      // Otherwise you will get an 'ExpressionChangedAfterItHasBeenCheckedError' error
      delay(1)
    ).subscribe(() => this.showSuggestionDialog());
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

  private get shouldShowSuggestionDialog(): Observable<boolean> {
    const isAsk$ = this.store.select(UserTagsSelectors.getIsAskToCreateVM);
    const vmCount$ = this.store.select(fromVMs.getVMCount);
    const dataReceivedAndUpdated$ = Observable.combineLatest(
      this.store.select(fromVMs.isLoading),
      this.store.select(fromVMs.isLoaded)
    ).pipe(
      map(([loading, loaded]) => !loading && loaded),
      filter(Boolean),
      first()
    );

    return dataReceivedAndUpdated$.pipe(
      mergeMap(() => Observable.zip(isAsk$, vmCount$).pipe(
        map(([isAsk, vmCount]) => isAsk && vmCount === 0 && !this.isCreationFormOpen)
      ))
    );
  }

  private get isCreationFormOpen(): boolean {
    return (
      this.activatedRoute.children.length &&
      this.activatedRoute.children[0].snapshot.url[0].path === 'create'
    );
  }

  private showSuggestionDialog(): void {
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
  }

}
