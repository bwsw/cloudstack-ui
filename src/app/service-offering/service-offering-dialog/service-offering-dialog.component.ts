import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public zoneId: string;
  @Input() public serviceOfferingId: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  public serviceOffering: ServiceOffering;
  public loading: boolean;


  public ngOnInit(): void {
    this.serviceOffering = this.serviceOfferings[0];
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }
    /*this.loading = true;
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
      this.configService.get<DefaultServiceOfferingConfigurationByZone>(
        'defaultServiceOfferingConfig');
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
        if (!a.isCustomized && b.isCustomized) {
          return -1;
        }
        if (a.isCustomized && !b.isCustomized) {
          return 1;
        }
        return 0;
      });

      return (!!this.virtualMachine.serviceOffering
        ? availableOfferings.filter(
          offering =>
            offering.id !== this.virtualMachine.serviceOffering.id)
        : availableOfferings).map((offering) => {
        return !offering.isCustomized
          ? offering
          : this.customServiceOfferingService.getCustomOfferingWithSetParams(
            offering,
            defaultParams[zone.id] && defaultParams[zone.id].customOfferingParams,
            customOfferingRestrictions[zone.id],
            resourceUsage
          );
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
  }*/
}
