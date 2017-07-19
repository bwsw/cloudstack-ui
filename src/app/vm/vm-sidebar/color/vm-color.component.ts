import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Color } from '../../../shared/models';
import { ConfigService } from '../../../shared/services';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';


@Component({
  selector: 'cs-vm-color',
  templateUrl: 'vm-color.component.html',
  styleUrls: ['vm-color.component.scss']
})
export class VmColorComponent implements OnChanges, OnInit, OnDestroy {
  @Input() public vm: VirtualMachine;

  public color: Color;
  public colorList: Array<Color>;

  public colorUpdateInProgress: boolean;
  private colorSubject = new Subject<Color>();

  constructor(
    private configService: ConfigService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    Observable.forkJoin(
      this.configService.get('themeColors'),
      this.configService.get('vmColors')
    ).subscribe(
      ([themeColors, vmColors]) => this.colorList = themeColors.concat(vmColors)
    );

    this.colorSubject
      .debounceTime(1000)
      .switchMap(color => {
        this.colorUpdateInProgress = true;
        return this.vmService.setColor(this.vm, color);
      })
      .subscribe(vm => {
        this.colorUpdateInProgress = false;
        this.vm = vm;
        this.vmService.updateVmInfo(this.vm);
      }, () => this.colorUpdateInProgress = false);
  }

  public ngOnChanges(): void {
    this.color = this.vm.getColor();
  }

  public ngOnDestroy(): void {
    this.colorSubject.unsubscribe();
  }

  public changeColor(color: Color): void {
    this.colorSubject.next(color);
  }
}
