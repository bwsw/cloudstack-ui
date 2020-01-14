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

  public loading = true;
  public snapshotsQuotaFilled = false;
  public secondaryStorageQuotaFilled = false;

  constructor(
    private dialogRef: MatDialogRef<SnapshotCreationComponent>,
    @Inject(MAT_DIALOG_DATA) private volume: Volume,
    private resourceUsageService: ResourceUsageService,
  ) {}

  public ngOnInit(): void {
    this.resourceUsageService.getResourceUsage().subscribe((resourceStats: ResourceStats) => {
      this.loading = false;

      this.snapshotsQuotaFilled = resourceStats.available.snapshots <= 0;
      // Secondary storage is in GiB, but volume size is in bytes.
      this.secondaryStorageQuotaFilled =
        resourceStats.available.secondaryStorage < Utils.convertToGb(this.volume.size);
    });
  }

  public onSubmit(): void {
    this.dialogRef.close({ name: this.name, desc: this.description });
  }
}
