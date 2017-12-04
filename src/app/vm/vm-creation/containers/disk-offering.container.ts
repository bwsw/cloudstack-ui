import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DiskOffering } from '../../../shared/models/disk-offering.model';

import * as fromDO from '../../../reducers/disk-offerings/redux/disk-offerings.reducers';

@Component({
  selector: 'cs-disk-offering-container',
  template: `
    <cs-disk-offering
      *ngIf="showSelector"
      name="diskOfferingSelector"
      [diskOfferingList]="diskOfferings$ | async"
      [isLoading]="isLoading$ | async"
      [ngModel]="diskOffering"
      (change)="diskOfferingChange.emit($event)"
    ></cs-disk-offering>`
})
export class DiskOfferingContainerComponent implements OnInit {
  readonly diskOfferings$ = this.store.select(fromDO.selectAll);
  readonly isLoading$ = this.store.select(fromDO.isLoading);

  @Input() public diskOffering: DiskOffering;
  @Input() public showSelector = false;
  @Output() public diskOfferingChange = new EventEmitter<DiskOffering>();

  constructor(private store: Store<State>) {
  }

  public ngOnInit() {
    this.diskOfferings$.subscribe(offerings => {
      if (!!offerings.length && !this.diskOffering) {
        this.diskOfferingChange.emit(offerings[0]);
      }
    });
  }
}
