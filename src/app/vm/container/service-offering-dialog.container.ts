import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import * as fromServiceOfferings from '../../reducers/service-offerings/redux/service-offerings.reducers';
import * as fromAuths from '../../reducers/auth/redux/auth.reducers';
import * as fromZones from '../../reducers/zones/redux/zones.reducers';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import { ConfigService } from '../../shared/services/config.service';
import { Observable } from 'rxjs/Observable';
import {
  CustomServiceOfferingService,
  DefaultServiceOfferingConfigurationByZone
} from '../../service-offering/custom-service-offering/service/custom-service-offering.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { VirtualMachine } from '../shared/vm.model';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { ICustomOfferingRestrictions } from '../../service-offering/custom-service-offering/custom-offering-restrictions';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Account } from '../../shared/models/account.model';


@Component({
  selector: 'cs-service-offering-dialog-container',
  template: `
    <cs-service-offering-dialog
      [serviceOfferings]="fetchData() | async"
      [serviceOfferingId]="virtualMachine.serviceOfferingId"
      [restrictions]="getRestrictions() | async"
      [zoneId]="virtualMachine.zoneId"
      (onServiceOfferingChange)="changeServiceOffering($event)"
    >
    </cs-service-offering-dialog>`,
})
export class ServiceOfferingDialogContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly offerings$ = this.store.select(fromServiceOfferings.selectAll);
  readonly user$ = this.store.select(fromAuths.getUserAccount);
  readonly zone$ = this.store.select(fromZones.getSelectedZone);

  public virtualMachine: VirtualMachine;
  public user: Account;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogService: DialogService,
    public dialogRef: MatDialogRef<ServiceOfferingDialogContainerComponent>,
    private configService: ConfigService,
    private serviceOfferingService: ServiceOfferingService,
    private customServiceOfferingService: CustomServiceOfferingService,
    private store: Store<State>,
  ) {
    super();
    this.virtualMachine = data.vm;
    this.user$
      .takeUntil(this.unsubscribe$)
      .subscribe((user) => {
        if (user) {
          this.user = user;
        }
      });

  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadSelectedZone(this.virtualMachine.zoneId));
  }

  public changeServiceOffering(serviceOffering) {
    this.store.dispatch(new vmActions.ChangeServiceOffering({
      vm: this.virtualMachine,
      offering: serviceOffering
    }));
    this.dialogRef.close();
  }

  public getRestrictions(): Observable<ICustomOfferingRestrictions> {
    return this.customServiceOfferingService
      .getCustomOfferingRestrictionsByZone(ResourceStats.fromAccount([this.user]))
      .map(restrictions => restrictions[this.virtualMachine.zoneId]);
  }

  public fetchData(): Observable<ServiceOffering[]> {
    const offeringAvailability = this.configService.get('offeringAvailability');
    const defaultParams =
      this.configService.get<DefaultServiceOfferingConfigurationByZone>('defaultServiceOfferingConfig');
    const customOfferingRestrictions = this.configService.get('customOfferingRestrictions');

    return Observable.combineLatest(this.offerings$, this.user$, this.zone$, (serviceOfferings, user, zone) => {
      const availableOfferings = this.serviceOfferingService.getAvailableByResourcesSync(
        serviceOfferings,
        offeringAvailability,
        customOfferingRestrictions,
        ResourceStats.fromAccount([user]),
        zone
      ).sort((a: ServiceOffering, b: ServiceOffering) => {
        if (!a.isCustomized && b.isCustomized) { return -1; }
        if (a.isCustomized && !b.isCustomized) { return 1; }
        return 0;
      });

      return (!!this.virtualMachine.serviceOffering
        ? availableOfferings.filter(
          offering =>
            offering.id !== this.virtualMachine.serviceOffering.id)
        : availableOfferings).map((offering) => {
        return !offering.isCustomized ? offering :
          this.customServiceOfferingService.getCustomOfferingWithSetParams(
            offering,
            defaultParams[zone.id].customOfferingParams,
            customOfferingRestrictions[zone.id],
            ResourceStats.fromAccount([user])
          )
      });
    });
  }

}
