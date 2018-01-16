import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import * as groupBy from 'lodash/groupBy';
import { Observable } from 'rxjs/Observable';
import {
  ServiceOffering,
  ServiceOfferingClass,
  ServiceOfferingClassKey
} from '../../shared/models/service-offering.model';
import { Tag } from '../../shared/models/tag.model';
import { Language } from '../../shared/services/language.service';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';

export const noGroup = '-1';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss']
})
export class ServiceOfferingListComponent implements OnChanges {
  @Input() public offeringList: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public classTags: Array<Tag>;
  @Input() public query: string;
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public defaultParams: ICustomServiceOffering;
  @Input() public selectedOffering: ServiceOffering;
  @Input() public isLoading = false;
  @Output() public selectedOfferingChange = new EventEmitter();

  public list: Array<{ group: ServiceOfferingClass, items: Array<ServiceOffering>}>;

  public groupings = {
    key: 'classes',
    label: 'SERVICE_OFFERING.FILTERS.GROUP_BY_CLASSES',
    selector: (item: ServiceOffering) => this.getGroup(item) || noGroup,
    group: (item: ServiceOffering) => this.getGroup(item)
  };

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  public ngOnChanges(changes): void {
    this.getGroupedOfferings();
  }

  public selectOffering(offering: ServiceOffering): void {
    if (offering.iscustomized) {
      this.showCustomOfferingDialog(offering, this.customOfferingRestrictions, this.defaultParams)
        .filter(res => Boolean(res))
        .subscribe(customOffering => {
          this.selectedOffering = customOffering;
          this.selectedOfferingChange.emit(this.selectedOffering);
        });
    } else {
      this.selectedOffering = offering;
      this.selectedOfferingChange.emit(this.selectedOffering);
    }
  }

  private showCustomOfferingDialog(
    offering: ServiceOffering,
    restriction: ICustomOfferingRestrictions,
    defaultParams: ICustomServiceOffering
  ): Observable<CustomServiceOffering> {
    return this.dialog.open(CustomServiceOfferingComponent, {
      width: '370px',
      data: {
        offering,
        defaultParams,
        restriction
      }
    }).afterClosed();

  }

  public get locale(): Language {
    return this.translateService.currentLang as Language;
  }

  public getGroup(item: ServiceOffering): ServiceOfferingClass {
    const tag = this.classTags.find(tag => tag.key === ServiceOfferingClassKey + '.' + item.id);
    const classKey = tag && tag.value || noGroup;
    const group = this.classes.find(c => c.id === classKey);
    return group;
  }

  public getDescription(group: ServiceOfferingClass) {
    return group && group.description
      && group.description[this.locale];
  }

  public getName(group: ServiceOfferingClass) {
    return group && group.name
      && group.name[this.locale] || 'SERVICE_OFFERING.FILTERS.COMMON';
  }

  public getGroupedOfferings() {
    if (this.groupings) {
      const groups = groupBy(this.offeringList, this.groupings.selector);
      this.list = Object.keys(groups).map(gn => {
        return {
          group: this.groupings.group(groups[gn][0]),
          items: groups[gn]
        };
      }).sort((group1, group2) => {
        if (!!group1) {
          return -1;
        }
        if (!!group2) {
          return 0
        } else {
          return 1;
        }
      });
    }
  }
}
