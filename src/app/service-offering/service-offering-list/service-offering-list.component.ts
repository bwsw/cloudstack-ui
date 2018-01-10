import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import {
  getGroupId,
  ServiceOffering,
  ServiceOfferingGroup
} from '../../shared/models/service-offering.model';
import { Language } from '../../shared/services/language.service';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';
import { CustomServiceOffering } from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import { ServiceOfferingItemComponent } from './service-offering-item.component';

export const noGroup = '-1';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss']
})
export class ServiceOfferingListComponent {
  @Input() public offeringList: Array<ServiceOffering>;
  @Input() public groups: Array<ServiceOfferingGroup>;
  @Input() public query: string;
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public selectedOffering: ServiceOffering;
  @Input() public isLoading = false;
  @Output() public selectedOfferingChange = new EventEmitter();

  public groupings = [
    {
      key: 'groups',
      label: 'SERVICE_OFFERING.FILTERS.GROUP_BY_GROUPS',
      selector: (item: ServiceOffering) => this.getGroup(item) || noGroup,
      name: (item: ServiceOffering) => this.getGroup(item) || 'SERVICE_OFFERING.FILTERS.COMMON'
    }
  ];
  public inputs;
  public outputs;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: ServiceOffering) =>
        item && this.selectedOffering && item.id === this.selectedOffering.id
    };

    this.outputs = {
      onClick: this.selectOffering.bind(this),
    };
  }

  public selectOffering(offering: ServiceOffering): void {
    if (offering.iscustomized) {
      this.showCustomOfferingDialog(offering, this.customOfferingRestrictions)
        .subscribe(customOffering => {
          this.selectedOffering = customOffering || offering;
          this.selectedOfferingChange.emit(this.selectedOffering);
        });
    } else {
      this.selectedOffering = offering;
      this.selectedOfferingChange.emit(this.selectedOffering);
    }
  }

  private showCustomOfferingDialog(
    offering: ServiceOffering,
    restriction: ICustomOfferingRestrictions
  ): Observable<CustomServiceOffering> {
    return this.dialog.open(CustomServiceOfferingComponent, {
      width: '370px',
      data: {
        offering,
        restriction
      }
    }).afterClosed();

  }

  public get locale(): Language {
    return this.translateService.currentLang as Language;
  }

  public get itemComponent() {
    return ServiceOfferingItemComponent;
  }

  private getGroup(item: ServiceOffering): string {
    return this.groups[getGroupId(item)]
        && this.groups[getGroupId(item)].translations
        && this.groups[getGroupId(item)].translations[this.locale];
  }
}
