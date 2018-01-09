import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import { Volume, volumeTypeNames } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'cs-volume-page-container',
  template: `
    <cs-volume-page
      [volumes]="volumes$ | async"
      [isLoading]="loading$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings$ | async"
    ></cs-volume-page>`
})
export class VolumePageContainerComponent implements OnInit, AfterViewInit {

  readonly volumes$ = this.store.select(fromVolumes.selectFilteredVolumes);
  readonly loading$ = this.store.select(fromVolumes.isLoading);
  readonly selectedGroupings$ = this.store.select(fromVolumes.filterSelectedGroupings);

  public groupings = [
    {
      key: 'zones',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: Volume) => item.zoneid,
      name: (item: Volume) => item.zonename
    },
    {
      key: 'types',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_TYPES',
      selector: (item: Volume) => item.type,
      name: (item: Volume) => volumeTypeNames[item.type]
    },
    {
      key: 'accounts',
      label: 'VOLUME_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: Volume) => item.account,
      name: (item: Volume) => this.getGroupName(item),
    }
  ];
  public query: string;

  public ngOnInit() {
    this.store.dispatch(new volumeActions.LoadVolumesRequest());
  }

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    if (!this.isAdmin()) {
      this.groupings = this.groupings.filter(g => g.key !== 'accounts');
    }
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  private getGroupName(volume: Volume) {
    return volume.domain !== 'ROOT'
      ? `${volume.domain}/${volume.account}`
      : volume.account;
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
