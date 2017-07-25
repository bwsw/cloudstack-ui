import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit, Optional,
  Output,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdSelectChange } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { CustomServiceOffering } from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-selector',
  templateUrl: 'service-offering-selector.component.html',
  styleUrls: ['service-offering-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServiceOfferingSelectorComponent),
      multi: true
    }
  ]
})
export class ServiceOfferingSelectorComponent implements ControlValueAccessor {
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public defaultServiceOffering: ServiceOffering;
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public zoneId: string;
  @Output() public change: EventEmitter<ServiceOffering>;

  private _serviceOffering: ServiceOffering;
  private previousOffering: ServiceOffering;

  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private translateService: TranslateService
  ) {
    this.change = new EventEmitter();
  }

  @Input()
  public get serviceOffering(): ServiceOffering {
    return this._serviceOffering;
  }

  public set serviceOffering(serviceOffering: ServiceOffering) {
    this._serviceOffering = serviceOffering;
    this.propagateChange(this.serviceOffering);
  }

  public get customOfferingDescription(): Observable<string> {
    if (!this.serviceOffering || !this.serviceOffering.areCustomParamsSet) {
      return Observable.of('');
    }

    const cpuNumber = this.serviceOffering.cpuNumber;
    const cpuSpeed = this.serviceOffering.cpuSpeed;
    const memory = this.serviceOffering.memory;

    return this.translateService.get(['MB', 'MHZ'])
      .map(({ MB, MHZ }) => `${cpuNumber}x${cpuSpeed} ${MHZ}, ${memory} ${MB}`);
  }

  public changeOffering(change: MdSelectChange): void {
    const newOffering = change.value as ServiceOffering;
    this.saveOffering();
    this.serviceOffering = newOffering;
    if (newOffering.isCustomized) {
      this.showCustomOfferingDialog()
        .subscribe(customOffering => {
          this.setCustomOffering(customOffering);
          this.change.next(this.serviceOffering);
        });
    } else {
      this.change.next(this.serviceOffering);
    }
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(): void {}

  public propagateChange: any = () => {};

  public writeValue(serviceOffering: ServiceOffering): void {
    if (serviceOffering) {
      this.serviceOffering = serviceOffering;
    }
  }

  private setCustomOffering(customOffering: CustomServiceOffering): void {
    if (customOffering) {
      this.updateCustomOfferingInList(customOffering);
      this.serviceOffering = customOffering;
    } else {
      this.restorePreviousOffering();
    }
  }

  private updateCustomOfferingInList(customOffering: CustomServiceOffering): void {
    this.serviceOfferings = this.serviceOfferings.map(offering => {
      if (offering.id === customOffering.id) {
        return customOffering;
      } else {
        return offering;
      }
    });
    this.cd.detectChanges();
  }

  private showCustomOfferingDialog(): Observable<CustomServiceOffering> {
    return this.dialogService.showCustomDialog({
      component: CustomServiceOfferingComponent,
      classes: 'custom-offering-dialog',
      providers: [
        {
          provide: 'offering',
          useValue: this.serviceOffering
        },
        {
          provide: 'restrictions',
          useValue: this.customOfferingRestrictions
        },
        {
          provide: 'zoneId',
          useValue: this.zoneId
        }
      ]
    }).switchMap(res => res.onHide());
  }

  private saveOffering(): void {
    this.previousOffering = this.serviceOffering;
  }

  private restorePreviousOffering(): void {
    this.serviceOffering = this.previousOffering;
  }
}
