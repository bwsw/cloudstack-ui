import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as snapshotActions from '../../reducers/snapshots/redux/snapshot.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { Grouping, Volume, volumeTypeNames } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-volume-page-container',
  template: `
    <cs-volume-page
      [volumes]="volumes$ | async"
      [query]="query$ | async"
      [isLoading]="loading$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings$ | async"
    ></cs-volume-page>`,
})
export class VolumePageContainerComponent implements OnInit, AfterViewInit {
  readonly volumes$ = this.store.pipe(select(fromVolumes.selectFilteredVolumes));
  readonly query$ = this.store.pipe(select(fromVolumes.filterQuery));
  readonly loading$ = this.store.pipe(select(fromVolumes.isLoading));
  readonly selectedGroupings$ = this.store.pipe(select(fromVolumes.filterSelectedGroupings));

  public groupings: Grouping[] = [
    {
      key: 'zones',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: Volume) => item.zoneid,
      name: (item: Volume) => item.zonename,
    },
    {
      key: 'types',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_TYPES',
      selector: (item: Volume) => item.type,
      name: (item: Volume) => volumeTypeNames[item.type],
    },
    {
      key: 'accounts',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: Volume) => item.account,
      name: (item: Volume) => this.getGroupName(item),
    },
  ];
  public query: string;

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {
    if (!this.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    }
  }

  public ngOnInit() {
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
    this.store.dispatch(new snapshotActions.LoadSnapshotRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  private getGroupName(volume: Volume) {
    return volume.domain !== 'ROOT' ? `${volume.domain}/${volume.account}` : volume.account;
  }
}
