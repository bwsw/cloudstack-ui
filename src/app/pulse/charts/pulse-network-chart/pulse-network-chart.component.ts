import { Component, OnInit } from '@angular/core';
import { VmService } from '../../../vm/shared/vm.service';
import { PulseService } from '../../pulse.service';
import { getChart, PulseChartComponent } from '../pulse-chart';

@Component({
  selector: 'cs-pulse-network-chart',
  templateUrl: './pulse-network-chart.component.html'
})
export class PulseNetworkChartComponent extends PulseChartComponent implements OnInit {
  public selectedMac: string;
  public availableMacs: Array<string>;

  constructor(pulse: PulseService, private vmService: VmService) {
    super(pulse);
  }

  public ngOnInit() {
    this.charts = getChart([
      { id: 'bits' },
      { id: 'packets' },
      {
        id: 'drops',
        labels: [],
        chartType: 'bar'
      },
      {
        id: 'errors',
        labels: [],
        chartType: 'bar'
      }
    ]);

    this.vmService
      .getList({ id: '523a20a8-ef13-4090-988b-be978dd74a59' })
      .subscribe(vms => {
        this.availableMacs = vms.map(_ => _.nic[0].macAddress);
        this.selectedMac = this.availableMacs[0];
      });
  }

  public updateData(aggregation: any) {
    this.pulse
      .network('523a20a8-ef13-4090-988b-be978dd74a59', this.selectedMac, {
        range: this.selectedScale.range,
        aggregation: aggregation,
        shift: '0w'
      })
      .subscribe(res => {
        const readBits = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.readBits
          })),
          label: `Network read ${aggregation}`,
          aggregation
        };
        const writeBits = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.writeBits
          })),
          label: `Network write ${aggregation}`,
          aggregation
        };
        this.addDataset('bits', [readBits, writeBits]);

        const readPackets = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.readPackets
          })),
          label: `Network read packets ${aggregation}`,
          aggregation
        };
        const writePackets = {
          data: res.map(_ => ({
            x: new Date(_.time),
            y: +_.writePackets
          })),
          label: `Network write packets ${aggregation}`,
          aggregation
        };
        this.addDataset('packets', [readPackets, writePackets]);


        const readDrops = {
          data: res.map(_ => +_.readDrops),
          label: `Network read drops ${aggregation}`,
          aggregation
        };
        const writeDrops = {
          data: res.map(_ => +_.writeDrops),
          label: `Network write drops ${aggregation}`,
          aggregation
        };
        this.addDataset('drops', [readDrops, writeDrops]);
        this.charts[2].labels = res.map(_ => new Date(_.time));

        const readErrors = {
          data: res.map(_ => +_.readErrors),
          label: `Network read errors ${aggregation}`,
          aggregation
        };
        const writeErrors = {
          data: res.map(_ => +_.writeErrors),
          label: `Network write errors ${aggregation}`,
          aggregation
        };
        this.addDataset('errors', [readErrors, writeErrors]);
        this.charts[3].labels = res.map(_ => new Date(_.time));
      });
  }
}
