import { Component, OnInit } from '@angular/core';
import { Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { PulseService } from '../../pulse.service';
import { getChart, PulseChartComponent } from '../pulse-chart';

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
      { id: 'bytes' },
      { id: 'iops' },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar'
      }
    ]);

    this.volumeService
      .getList({ virtualMachineId: '523a20a8-ef13-4090-988b-be978dd74a59' })
      .subscribe(volumes => {
        this.availableVolumes = volumes;
        this.selectedVolume = this.availableVolumes[0];
      });
  }

  public updateData(aggregation: any) {
    this.pulse
      .disk('523a20a8-ef13-4090-988b-be978dd74a59', this.selectedVolume.id, {
        range: this.selectedScale.range,
        aggregation: aggregation,
        shift: '0w'
      })
      .subscribe(res => {
        const readBytes = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.readBytes
          })),
          label: `Disk read ${aggregation}`,
          aggregation
        };
        const writeBytes = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.writeBytes
          })),
          label: `Disk write ${aggregation}`,
          aggregation
        };
        this.addDataset('bytes', [readBytes, writeBytes]);


        const readIops = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.readIOPS
          })),
          label: `Disk read iops ${aggregation}`,
          aggregation
        };
        const writeIops = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.writeIOPS
          })),
          label: `Disk write iops ${aggregation}`,
          aggregation
        };

        this.addDataset('iops', [readIops, writeIops]);


        this.charts[2].labels = res.map(_ => new Date(_.time)); // TODO
        const errors = {
          data: res.map(_ => +_.ioErrors),
          label: `Disk io errors ${aggregation}`,
          aggregation
        };
        this.addDataset('errors', errors);
      });
  }
}
