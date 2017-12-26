import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Snapshot } from '../../../../shared/models';
import { SnapshotActionService } from './snapshot-action.service';

@Component({
  selector: 'cs-snapshot-action',
  template: `
    <ng-container *ngFor="let action of actions">
      <button
        *ngIf="action.canActivate(snapshot)"
        mat-menu-item (click)="activateAction(action, snapshot)"
      >
        <mat-icon>{{ action.icon }}</mat-icon>
        <span>{{ action.name | translate }}</span>
      </button>
    </ng-container>`
})
export class SnapshotActionComponent {
  @Input() public snapshot: Snapshot;
  @Output() public onTemplateCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onVolumeCreate: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotRevert: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output() public onSnapshotDelete: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();

  public actions: any[];

  constructor(private snapshotActionService: SnapshotActionService) {
    this.actions = this.snapshotActionService.actions;
  }

  public activateAction(action, snapshot: Snapshot) {
    switch (action.command) {
      case 'createTemplate': {
        this.onTemplateCreate.emit(snapshot);
        break;
      }
      case 'createVolume': {
        this.onVolumeCreate.emit(snapshot);
        break;
      }
      case 'revert': {
        this.onSnapshotRevert.emit(snapshot);
        break;
      }
      case 'delete': {
        this.onSnapshotDelete.emit(snapshot);
        break;
      }
    }
  }
}
