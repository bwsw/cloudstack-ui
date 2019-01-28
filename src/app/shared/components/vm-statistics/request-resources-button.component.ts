import { Component, EventEmitter, Input, Output } from '@angular/core';

// todo: move to request resources module

@Component({
  selector: 'cs-request-resources-button',
  template: `
    <button
      *ngIf="isResourceLimitsEnabled && !isAdmin"
      mat-raised-button
      (click)="onRequestResources()"
    >
      {{ 'RESOURCE_QUOTAS_PAGE.REQUEST.REQUEST_RESOURCES_BUTTON' | translate }}
    </button>
  `,
})
export class RequestResourcesButtonComponent {
  @Input()
  isAdmin: boolean;
  @Input()
  isResourceLimitsEnabled: boolean;
  @Output()
  requestResources = new EventEmitter();

  public onRequestResources() {
    this.requestResources.emit();
  }
}
