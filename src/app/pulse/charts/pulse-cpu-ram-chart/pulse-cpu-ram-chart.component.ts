import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { humanReadableSize } from '../../unitsUtils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';


@Component({
  selector: 'cs-pulse-cpu-chart',
  templateUrl: '../pulse-chart.html'
})
export class PulseCpuRamChartComponent extends PulseChartComponent implements OnInit {
  public ngOnInit() {
    this.charts = getChart([
      {
        id: 'cpu',
        options: Object.assign({}, defaultChartOptions, {
          scales: {
            xAxes: [{
              type: 'time',
              position: 'bottom'
            }],
            yAxes: [{
              ticks: {
                suggestedMin: 0,
                suggestedMax: 100,
                userCallback(val) {
                  return `${val}%`;
                }
              }
            }],
          }
        })
      },
      {
        id: 'ram',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [{
              ticks: {
                suggestedMin: 0,
                userCallback(val) {
                  return humanReadableSize(val * 1024);
                }
              }
            }]
          }
        }
      }
    ]);
  }

  public update() {
    const cpuRequests = this.selectedAggregations.map(_ =>
      this.pulse.cpuTime(this.vmId, {
        range: this.selectedScale.range,
        aggregation: _,
        shift: `${this.shift}${this.selectedShift || 'w'}`
      })
    );

    const ramRequests = this.selectedAggregations.map(_ =>
      this.pulse.ram(this.vmId, {
        range: this.selectedScale.range,
        aggregation: _,
        shift: `${this.shift}${this.selectedShift || 'w'}`
      })
    );
    if (cpuRequests.length) {
      Observable.forkJoin(
        Observable.forkJoin(...cpuRequests),
        Observable.forkJoin(...ramRequests)
      )
        .subscribe(([data, ram]) => {
          const datasets = data.map((res: any, ind) => {
            return {
              data: res.map(_ => ({
                x: new Date(_.time),
                y: Math.min(+_.cpuTime, 100)
              })),
              label: `CPU ${this.selectedAggregations[ind]}`,
            };
          });
          this.updateDatasets('cpu', datasets);


          const asd = ram.map((res: any, ind) => {
            return {
              data: res.map(_ => ({
                x: new Date(_.time),
                y: +_.ram
              })),
              label: `RAM ${this.selectedAggregations[ind]}`,
            };
          });
          this.updateDatasets('ram', asd);
        });
    }
  }
}
