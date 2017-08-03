import { Component, OnInit } from '@angular/core';
import { getChart, PulseChartComponent } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-ram-chart',
  templateUrl: '../pulse-chart.html'
})
export class PulseRamChartComponent extends PulseChartComponent implements OnInit {
  public ngOnInit() {
    this.charts = getChart([{ id: 'ram' }]);
  }

  public updateData(aggregation: any) {
    this.pulse
      .ram('523a20a8-ef13-4090-988b-be978dd74a59', {
        range: this.selectedScale.range,
        aggregation: aggregation,
        shift: '0w'
      })
      .subscribe(res => {
        const dataset = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.ram
          })),
          label: `RAM ${aggregation}`,
          aggregation
        };
        this.addDataset('ram', dataset);
      });
  }
}
