import { Component, OnInit } from '@angular/core';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-cpu-chart',
  templateUrl: '../pulse-chart.html'
})
export class PulseCpuChartComponent extends PulseChartComponent implements OnInit {
  chartOptions = Object.assign({}, defaultChartOptions, {
    yAxes: [{
      ticks: {
        suggestedMin: 0,
        suggestedMax: 100
      }
    }]
  });

  public ngOnInit() {
    this.charts = getChart([{
      id: 'cpu',
      options: this.chartOptions
    }]);
  }

  public updateData(aggregation: any) {
    this.pulse
      .cpuTime('523a20a8-ef13-4090-988b-be978dd74a59', {
        range: this.selectedScale.range,
        aggregation: aggregation,
        shift: '1m'
      })
      .subscribe(res => {
        const dataset = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: Math.min(+_.cpuTime, 100)
          })),
          label: `CPU ${aggregation}`,
          aggregation
        };
        this.addDataset('cpu', dataset);
      });
  }
}
