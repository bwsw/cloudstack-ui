import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Color } from '../../../shared/models';
import { ConfigService } from '../../../shared/services/config.service';
import { VirtualMachine } from '../../shared/vm.model';
import { VmService } from '../../shared/vm.service';
import { VmTagService } from '../../../shared/services/tags/vm/vm-tag.service';


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
    private vmService: VmService,
    private vmTagService: VmTagService
  ) {}

  public ngOnInit(): void {
    const themeColors = this.configService.get('themeColors');
    const vmColors = this.configService.get('vmColors');
    this.colorList = themeColors.concat(vmColors);

    this.colorSubject
      .debounceTime(1000)
      .switchMap(color => {
        this.colorUpdateInProgress = true;
        return this.vmTagService.setColor(this.vm, color);
      })
      .subscribe(vm => {
        this.colorUpdateInProgress = false;
        this.vm = vm;
        this.vmService.updateVmInfo(this.vm);
      }, () => this.colorUpdateInProgress = false);
  }

  public ngOnChanges(): void {
    this.color = this.vmTagService.getColorSync(this.vm);
  }

  public ngOnDestroy(): void {
    this.colorSubject.unsubscribe();
  }

  public changeColor(color: Color): void {
    this.colorSubject.next(color);
  }
}
