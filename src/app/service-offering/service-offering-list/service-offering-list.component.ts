import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { classesFilter } from '../../reducers/service-offerings/redux/service-offerings.reducers';
import {
  ServiceOffering,
  ServiceOfferingClass
} from '../../shared/models/service-offering.model';
import { Tag } from '../../shared/models/tag.model';
import { Language } from '../../shared/services/language.service';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';
import {
  CustomServiceOffering,
  ICustomServiceOffering
} from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss']
})
export class ServiceOfferingListComponent implements OnChanges {
  @Input() public offeringList: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
  @Input() public classTags: Array<Tag>;
  @Input() public query: string;
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public defaultParams: ICustomServiceOffering;
  @Input() public selectedOffering: ServiceOffering;
  @Input() public isLoading = false;
  @Output() public selectedOfferingChange = new EventEmitter();

  public list: Array<{ soClass: ServiceOfferingClass, items: Array<ServiceOffering>}>;

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

  public getDescription(soClass: ServiceOfferingClass) {
    return soClass && soClass.description
      && soClass.description[this.locale];
  }

  public getName(soClass: ServiceOfferingClass) {
    return soClass && soClass.name
      && soClass.name[this.locale] || 'SERVICE_OFFERING.FILTERS.COMMON';
  }

  public getGroupedOfferings() {
    const showClasses = this.classes
      .filter(soClass => this.selectedClasses.indexOf(soClass.id) != -1);
    if (this.classes.length) {
      this.list = (showClasses.length ? showClasses : this.classes)
        .map(soClass => {
          return {
            soClass,
            items: this.filterOfferings(this.offeringList, soClass)
          };
        })
    } else {
      this.list = [ { soClass: null, items: this.offeringList } ];
    }
  }

  public filterOfferings(list: ServiceOffering[], soClass: ServiceOfferingClass) {
    const classesMap = [ soClass ].reduce((m, i) => ({ ...m, [i.id]: i }), {});
    return list.filter(offering => classesFilter(offering, this.classTags, classesMap));
  }
}
