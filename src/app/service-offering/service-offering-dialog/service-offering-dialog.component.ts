import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Zone } from '../../shared/models';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ConfigService } from '../../shared/services/config.service';
import { ResourceUsageService } from '../../shared/services/resource-usage.service';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmChangeServiceOfferingAction } from '../../vm/vm-actions/vm-change-service-offering';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOfferingService,
  DefaultServiceOfferingConfigurationByZone
} from '../custom-service-offering/service/custom-service-offering.service';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  public serviceOffering: ServiceOffering;
  public serviceOfferings: Array<ServiceOffering>;
  public loading: boolean;
  public virtualMachine: VirtualMachine;

  public restrictions$: Observable<ICustomOfferingRestrictions>;

  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    public dialogRef: MatDialogRef<ServiceOfferingDialogComponent>,
    public customServiceOfferingService: CustomServiceOfferingService,
    private configService: ConfigService,
    private serviceOfferingService: ServiceOfferingService,
    private resourceUsageService: ResourceUsageService,
    private vmChangeServiceOfferingAction: VmChangeServiceOfferingAction,
    private zoneService: ZoneService
  ) {
    this.restrictions$ = this.getRestrictions();
    this.virtualMachine = data.virtualMachine;
  }

  public ngOnInit(): void {
    this.zoneService.get(this.virtualMachine.zoneId)
      .switchMap(zone => this.fetchData(zone))
      .do(offerings => this.serviceOfferings = offerings)
      .switchMap(offerings => this.getDefaultServiceOffering(offerings))
      .subscribe(offering => this.serviceOffering = offering);
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.loading = true;
    this.vmChangeServiceOfferingAction.activate(
      this.virtualMachine,
      { serviceOffering: this.serviceOffering }
    )
      .finally(() => this.loading = false)
      .subscribe(() => this.dialogRef.close(this.serviceOffering));
  }

  private fetchData(zone: Zone): Observable<ServiceOffering[]> {
    const offeringAvailability = this.configService.get('offeringAvailability');
    const defaultParams =
      this.configService.get<DefaultServiceOfferingConfigurationByZone>('defaultServiceOfferingConfig');
    const customOfferingRestrictions = this.configService.get('customOfferingRestrictions');

    return Observable.forkJoin(
      this.serviceOfferingService.getList({ zone }),
      this.resourceUsageService.getResourceUsage()
    ).map((
      [
        serviceOfferings,
        resourceUsage
      ]
    ) => {
      const availableOfferings = this.serviceOfferingService.getAvailableByResourcesSync(
        serviceOfferings,
        offeringAvailability,
        customOfferingRestrictions,
        resourceUsage,
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
              resourceUsage
            )
          });
    });
  }

  private getRestrictions(): Observable<ICustomOfferingRestrictions> {
    return this.customServiceOfferingService
      .getCustomOfferingRestrictionsByZone()
      .map(restrictions => restrictions[this.virtualMachine.zoneId]);
  }

  private getDefaultServiceOffering(offerings: Array<ServiceOffering>): Observable<ServiceOffering> {
    const configuration = this.configService
      .get<DefaultServiceOfferingConfigurationByZone>('defaultServiceOfferingConfig');
    return this.zoneService.get(this.virtualMachine.zoneId)
      .map(zone => {
        const defaultOfferingId = configuration && configuration[zone.id] && configuration[zone.id].offering;
        const defaultOffering = offerings.find(_ => _.id === defaultOfferingId);
        return defaultOffering || offerings[0];
      });
  }
}
