import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as moment from 'moment';
import { Volume } from '../../../../../shared/models';
import {
  ResourceStats,
  ResourceUsageService,
} from '../../../../../shared/services/resource-usage.service';
import { Utils } from '../../../../../shared/services/utils/utils.service';

@Component({
  selector: 'cs-snapshot-creation',
  templateUrl: 'snapshot-creation.component.html',
  styleUrls: ['snapshot-creation.component.scss'],
})
export class SnapshotCreationComponent implements OnInit {
  public name: string = moment().format('YYMMDD-HHmm');
  public description: string;

  public get loading() {
    return this.resourceStats == null;
  }

  public get storageAvailable() {
    return this.resourceStats && this.resourceStats.available.secondaryStorage;
  }

  public readonly storageRequired: number;

  public get storageQuotaFilled() {
    return (
      this.resourceStats && this.resourceStats.available.secondaryStorage < this.storageRequired
    );
  }

  public get snapshotsQuotaFilled() {
    return this.resourceStats && this.resourceStats.available.snapshots <= 0;
  }

  private resourceStats: ResourceStats | null;

  constructor(
    private dialogRef: MatDialogRef<SnapshotCreationComponent>,
    @Inject(MAT_DIALOG_DATA) private volume: Volume,
    private resourceUsageService: ResourceUsageService,
  ) {
    // Secondary storage is in GiB, but volume size is in bytes.
    this.storageRequired = Utils.convertToGb(this.volume.size);
  }

  public ngOnInit(): void {
    this.resourceUsageService
      .getResourceUsage()
      .subscribe((resourceStats: ResourceStats) => (this.resourceStats = resourceStats));
  }

  public onSubmit(): void {
    this.dialogRef.close({ name: this.name, desc: this.description });
  }
}
