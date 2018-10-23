import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { isRoot, Volume } from '../../../shared/models/volume.model';
import { VolumeService } from '../../../shared/services/volume.service';
import { PulseService } from '../../pulse.service';
import { humanReadableSize } from '../../units-utils';
import { defaultChartOptions, getChart, PulseChartComponent } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-disk-chart',
  templateUrl: './pulse-disk-chart.component.html',
  styleUrls: ['./pulse-disk-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PulseDiskChartComponent extends PulseChartComponent implements OnInit {
  @Input()
  public vmId: string;
  @Output()
  public volumeChange = new EventEmitter();
  public selectedVolume: Volume;
  public availableVolumes: Volume[];

  constructor(pulse: PulseService, cd: ChangeDetectorRef, private volumeService: VolumeService) {
    super(pulse, cd);
  }

  public ngOnInit() {
    this.charts = getChart([
      {
        id: 'bytes',
        options: {
          ...defaultChartOptions,
          scales: {
            ...defaultChartOptions.scales,
            yAxes: [
              {
                ticks: {
                  padding: 40,
                  mirror: true,
                  suggestedMin: 0,
                  userCallback(val) {
                    return !!humanReadableSize(val, true)
                      ? `${humanReadableSize(val, true)}/s`
                      : null;
                  },
                },
              },
            ],
          },
        },
      },
      { id: 'iops' },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar',
      },
    ]);

    this.volumeService.getList({ virtualMachineId: this.vmId }).subscribe(volumes => {
      const rootDiskInd = volumes.findIndex(isRoot);
      if (rootDiskInd !== -1) {
        const temp = volumes[0];
        volumes[0] = volumes[rootDiskInd];
        volumes[rootDiskInd] = temp;
      }
      this.availableVolumes = volumes;
      this.selectedVolume = this.availableVolumes[0];
      this.cd.markForCheck();
    });
  }

  public update(params, forceUpdate) {
    const requests = params.selectedAggregations.map(_ =>
      this.pulse.disk(
        params.vmId,
        this.selectedVolume.id,
        {
          range: params.selectedScale.range,
          aggregation: _,
          shift: `${params.shiftAmount}${params.selectedShift || 'w'}`,
        },
        forceUpdate,
      ),
    );

    this.setLoading(!forceUpdate);
    // todo
    // tslint:disable-next-line:deprecation
    forkJoin(...requests)
      .pipe(finalize(() => this.setLoading(false)))
      .subscribe(data => {
        const sets = {
          bytes: [],
          iops: [],
          errors: [],
        };
        data.forEach((res: any, ind) => {
          const aggregation = params.selectedAggregations[ind];
          const readBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readBytes,
            })),
            label: `${this.translations['DISK_READ']} ${aggregation}`,
          };
          const writeBytes = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeBytes,
            })),
            label: `${this.translations['DISK_WRITE']} ${aggregation}`,
          };
          sets.bytes.push(readBytes, writeBytes);

          const readIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.readIOPS,
            })),
            label: `${this.translations['DISK_READ_IOPS']} ${aggregation}`,
          };
          const writeIops = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.writeIOPS,
            })),
            label: `${this.translations['DISK_WRITE_IOPS']} ${aggregation}`,
          };

          sets.iops.push(readIops, writeIops);

          const errors = {
            data: res.map(_ => ({
              x: new Date(_.time),
              y: +_.ioErrors,
            })),
            label: `${this.translations['DISK_IO_ERRORS']} ${aggregation}`,
          };
          sets.errors.push(errors);
        });
        Object.keys(sets).forEach(_ => this.updateDatasets(_, sets[_]));

        this.cd.markForCheck();
      });
  }
}
