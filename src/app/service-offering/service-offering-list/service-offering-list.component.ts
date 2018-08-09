import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { classesFilter } from '../../reducers/service-offerings/redux/service-offerings.reducers';
import { ICustomOfferingRestrictions, ServiceOffering, ServiceOfferingClass } from '../../shared/models';
import { CustomServiceOffering, ICustomServiceOffering } from '../custom-service-offering/custom-service-offering';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import { Language } from '../../shared/types';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss']
})
export class ServiceOfferingListComponent implements OnChanges {
  @Input() public offeringList: Array<ServiceOffering>;
  @Input() public classes: Array<ServiceOfferingClass>;
  @Input() public selectedClasses: Array<string>;
  @Input() public query: string;
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public defaultParams: ICustomServiceOffering;
  @Input() public selectedOffering: ServiceOffering;
  @Input() public isLoading = false;
  @Input() public showFields: boolean;
  @Output() public selectedOfferingChange = new EventEmitter();

  public list: Array<{ soClass: ServiceOfferingClass, items: MatTableDataSource<ServiceOffering> }>;
  public columnsToDisplay = [];

  private mainColumns = ['name', 'cpuCoresNumber', 'cpuSpeed', 'memory', 'networkRate'];
  private allColumns = [...this.mainColumns, 'diskBytesRead', 'diskBytesWrite', 'diskIopsRead', 'diskIopsWrite'];


  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.getGroupedOfferings();
    this.onShowFieldsChange(changes.showFields);
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
      .filter(soClass => this.selectedClasses.indexOf(soClass.id) !== -1);
    if (this.classes.length) {
      this.list = (showClasses.length ? showClasses : this.classes)
        .map(soClass => {
          return {
            soClass,
            items: new MatTableDataSource(this.filterOfferings(this.offeringList, soClass))
          };
        })
    } else {
      this.list = [{ soClass: null, items: new MatTableDataSource(this.offeringList) }];
    }
  }

  public filterOfferings(list: ServiceOffering[], soClass: ServiceOfferingClass) {
    const classesMap = [soClass].reduce((m, i) => ({ ...m, [i.id]: i }), {});
    return list.filter(offering => classesFilter(offering, this.classes, classesMap));
  }

  private onShowFieldsChange(showFields: SimpleChange) {
    const radio = 'radioButton';
    console.log('show', showFields);
    if (!showFields) {
      return;
    }

    this.columnsToDisplay = showFields.currentValue ? [...this.allColumns, radio] : [...this.mainColumns, radio];
  }
}
