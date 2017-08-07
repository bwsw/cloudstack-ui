import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { PulseService } from '../../pulse/pulse.service';

@Component({
  selector: 'cs-vm-pulse',
  templateUrl: './vm-pulse.component.html',
  styleUrls: ['./vm-pulse.component.scss']
})
export class VmPulseComponent implements OnInit {
  public permittedIntervals;

  constructor(
    @Inject(MD_DIALOG_DATA) public vmId: string,
    private pulse: PulseService
  ) {
  }

  public ngOnInit() {
    this.pulse.getPermittedIntervals().subscribe(intervals => {
      intervals.scales = Object.values(intervals.scales);
      this.permittedIntervals = intervals;
    });
  }
}
