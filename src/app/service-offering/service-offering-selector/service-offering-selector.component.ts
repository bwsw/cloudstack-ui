import { Component, OnInit, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { MdlSelectComponent } from '@angular2-mdl-ext/select';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import { MdlDialogService } from 'angular2-mdl';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html'
})
export class ServiceOfferingSelectorComponent implements OnInit {
  @Input() public zoneId: string;
  @Output() public offeringChanged = new EventEmitter();
  @ViewChild(MdlSelectComponent) public selectComponent: MdlSelectComponent;
  public serviceOfferings: Array<ServiceOffering>;
  private _serviceOffering: ServiceOffering;

  constructor(
    private dialogService: MdlDialogService,
    private serviceOfferingFilterService: ServiceOfferingFilterService
  ) { }

  public propagateChange: any = () => {};

  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(value) {
    this._serviceOffering = value;
    this.offeringChanged.emit(this.serviceOffering);
  }

  public ngOnInit(): void {
    if (this.zoneId == null) {
      throw new Error('Attribute \zoneId\' is required');
    }

    this.serviceOfferingFilterService.getAvailable()
      .subscribe(availableOfferings => {
        this.serviceOfferings = availableOfferings;
        if (this.serviceOfferings.length) {
          this.serviceOffering = this.serviceOfferings[0];
        }
      });
  }

  public changeValue(newValue: ServiceOffering): void {
    if (newValue.isCustomized) {
      this.dialogService.showCustomDialog({
        component: CustomServiceOfferingComponent,
        classes: 'custom-offering-dialog',
        providers: [{ provide: 'zoneId', useValue: this.zoneId }]
      })
        .switchMap(res => res.onHide())
        .subscribe(result => {
          if (result) {
            newValue.cpuNumber = result.cpuNumber;
            newValue.cpuSpeed = result.cpuSpeed;
            newValue.memory = result.memory;
            this.serviceOffering = newValue;
          } else {
            this.selectComponent.writeValue(this.serviceOffering);
          }
        });
    } else {
      this.serviceOffering = newValue;
    }
  }
}
