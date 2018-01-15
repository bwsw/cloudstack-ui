import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Volume } from '../../../../../shared/models/volume.model';
import {
  ResourceStats,
  ResourceUsageService
} from '../../../../../shared/services/resource-usage.service';

import * as moment from 'moment';

@Component({
  selector: 'cs-snapshot-creation',
  templateUrl: 'snapshot-creation.component.html',
  styleUrls: ['snapshot-creation.component.scss']
})
export class SnapshotCreationComponent implements OnInit {
  public name: string;
  public description: string;

  public loading = true;
  public enoughResources: boolean;

  constructor(
    private dialogRef: MatDialogRef<SnapshotCreationComponent>,
    @Inject(MAT_DIALOG_DATA) private volume: Volume,
    private resourceUsageService: ResourceUsageService,
  ) {
  }

  public ngOnInit(): void {
    this.name = this.defaultName;

    this.resourceUsageService.getResourceUsage()
      .subscribe((resourceStats: ResourceStats) => {
        this.loading = false;
        this.enoughResources = resourceStats.available.snapshots > 0;
      });
  }

  public get defaultName(): string {
    return moment().format('YYMMDD-HHmm');
  }

  public onSubmit(): void {
    this.dialogRef.close({ name: this.name, desc: this.description });
  }
}
