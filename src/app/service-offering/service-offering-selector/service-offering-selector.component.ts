import {
  Component, OnInit, ViewChild, EventEmitter, Output, Input,
  SimpleChanges, OnChanges
} from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { MdlSelectComponent } from '@angular2-mdl-ext/select';
import {
  CustomServiceOfferingComponent,
  CustomServiceOffering
} from '../custom-service-offering/custom-service-offering.component';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { Observable } from 'rxjs';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html',
  styleUrls: ['service-offering-selector.component.scss']
})
export class ServiceOfferingSelectorComponent implements OnInit, OnChanges {
  @Input() public zoneId: string;
  @Input() public offering: CustomServiceOffering;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Output() public offeringChanged = new EventEmitter();
  @ViewChild(MdlSelectComponent) public selectComponent: MdlSelectComponent;

  public cpuNumber: number;
  public cpuSpeed: number;
  public memory: number;

  private _serviceOffering: ServiceOffering;


  constructor(
    private dialogService: MdlDialogService,
    private translateService: TranslateService
  ) { }

  @Input()
  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(value) {
    this._serviceOffering = value;

    let result = Object.assign({}, this.serviceOffering);

    if (this.serviceOffering.isCustomized) {
      result.cpuNumber = this.cpuNumber;
      result.cpuSpeed = this.cpuSpeed;
      result.memory = this.memory;
    }

    this.offeringChanged.emit(result);
  }

  public ngOnInit(): void {
    if (this.zoneId == null) {
      throw new Error('Attribute \'zoneId\' is required');
    }
    if (this.serviceOfferings == null) {
      throw new Error('Attribute \'serviceOfferings\' is required');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if ('serviceOfferings' in changes) {
      if (this.serviceOfferings.length) {
        this.serviceOffering = this.serviceOfferings[0];
        this.offering = undefined;
        this.cpuNumber = undefined;
        this.cpuSpeed = undefined;
        this.memory = undefined;
      }
    }
  }

  public get customOfferingData(): Observable<string> {
    if (!this.cpuSpeed || !this.cpuNumber || !this.memory) {
      return Observable.of('');
    }
    return this.translateService.get(['MB', 'MHZ'])
      .map(strings => `${this.cpuNumber}x${this.cpuSpeed} ${strings['MHZ']}, ${this.memory} ${strings['MB']}`);
  }

  public changeValue(newValue: ServiceOffering): void {
    if (newValue.isCustomized) {
      this.dialogService.showCustomDialog({
        component: CustomServiceOfferingComponent,
        classes: 'custom-offering-dialog',
        providers: [
          {
            provide: 'zoneId',
            useValue: this.zoneId
          },
          {
            provide: 'offering',
            useValue: this.offering
          }
        ]
      })
        .switchMap(res => res.onHide())
        .subscribe(result => {
          if (result) {
            this.cpuNumber = result.cpuNumber;
            this.cpuSpeed = result.cpuSpeed;
            this.memory = result.memory;
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
