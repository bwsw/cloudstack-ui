import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action, Snapshot } from '../../../../shared/models';
import { SnapshotActions, SnapshotActionService } from './snapshot-action.service';

@Component({
  selector: 'cs-snapshot-action',
  template: `
    <ng-container *ngFor="let action of actions">
      <button
        mat-menu-item
        (click)="activateAction(action, snapshot)"
        [disabled]="!action.canActivate(snapshot)"
      >
        <mat-icon [ngClass]="action.icon"></mat-icon>
        <span>{{ action.name | translate }}</span>
      </button>
    </ng-container>`,
})
export class SnapshotActionComponent {
  @Input()
  public snapshot: Snapshot;
  @Output()
  public templateCreated: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public volumeCreated: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public snapshotReverted: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();
  @Output()
  public snapshotDeleted: EventEmitter<Snapshot> = new EventEmitter<Snapshot>();

  public actions: Action<Snapshot>[];

  constructor(private snapshotActionService: SnapshotActionService) {
    this.actions = this.snapshotActionService.actions;
  }

  public activateAction(action, snapshot: Snapshot) {
    switch (action.command) {
      case SnapshotActions.CreateTemplate: {
        this.templateCreated.emit(snapshot);
        break;
      }
      case SnapshotActions.CreateVolume: {
        this.volumeCreated.emit(snapshot);
        break;
      }
      case SnapshotActions.Revert: {
        this.snapshotReverted.emit(snapshot);
        break;
      }
      case SnapshotActions.Delete: {
        this.snapshotDeleted.emit(snapshot);
        break;
      }
      default:
        break;
    }
  }
}
