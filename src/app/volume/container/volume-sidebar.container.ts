import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { select, Store } from '@ngrx/store';
import * as volumeEvent from '../../reducers/volumes/redux/volumes.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';

@Component({
  selector: 'cs-volume-sidebar-container',
  template: `
    <cs-volume-sidebar
      [entity]="volume$ | async"
    ></cs-volume-sidebar>`,
})
export class VolumeSidebarContainerComponent implements OnInit {
  readonly volume$ = this.store.pipe(select(fromVolumes.getSelectedVolume));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new volumeEvent.LoadSelectedVolume(params['id']));
  }
}
