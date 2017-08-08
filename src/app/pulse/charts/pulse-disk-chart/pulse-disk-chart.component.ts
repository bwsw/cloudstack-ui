import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { PulseService } from '../../pulse.service';
import { humanReadableSize } from '../../unitsUtils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';


@Component({
  selector: 'cs-pulse-disk-chart',
  templateUrl: './pulse-disk-chart.component.html'
})
export class PulseDiskChartComponent extends PulseChartComponent implements OnInit {
  public selectedVolume: Volume;
  public availableVolumes: Array<Volume>;

  constructor(pulse: PulseService, private volumeService: VolumeService) {
    super(pulse);
  }

  public ngOnInit() {
    this.charts = getChart([
      {
        id: 'bytes',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [{
              ticks: {
                suggestedMin: 0,
                userCallback(val) {
                  return humanReadableSize(val, true);
                }
              }
            }]
          }
        }
      },
      { id: 'iops' },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar'
      }
    ]);

    this.volumeService
      .getList({ virtualMachineId: this.vmId })
      .subscribe(volumes => {
        this.availableVolumes = volumes;
        this.selectedVolume = this.availableVolumes[0];
      });
  }

  public update() {
    const requests = this.selectedAggregations.map(_ =>
      this.pulse.disk(this.vmId, this.selectedVolume.id, {
        range: this.selectedScale.range,
        aggregation: _,
        shift: `${this.shift}${this.selectedShift || 'w'}`
      })
    );

    Observable.forkJoin(...requests)
      .subscribe(data => {
        const sets = {
          bytes: [],
          iops: [],
          errors: []
        };
        data.forEach((res: any, ind) => {
          const readBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readBytes
            })),
            label: `Disk read ${this.selectedAggregations[ind]}`
          };
          const writeBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBytes
            })),
            label: `Disk write ${this.selectedAggregations[ind]}`
          };
          sets.bytes.push(readBytes, writeBytes);


          const readIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readIOPS
            })),
            label: `Disk read iops ${this.selectedAggregations[ind]}`
          };
          const writeIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeIOPS
            })),
            label: `Disk write iops ${this.selectedAggregations[ind]}`
          };

          sets.iops.push(readIops, writeIops);


          this.charts[2].labels = res.map(_ => new Date(_.time)); // TODO
          const errors = {
            data: res.map(_ => +_.ioErrors),
            label: `Disk io errors ${this.selectedAggregations[ind]}`
          };
          sets.errors.push(errors);
        });
        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));
      });
  }
}
