import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { classesFilter } from '../../reducers/service-offerings/redux/service-offerings.reducers';
import { Account, ComputeOfferingClass, ServiceOffering } from '../../shared/models';
import { CustomServiceOfferingComponent } from '../custom-service-offering/custom-service-offering.component';
import { Language } from '../../shared/types';
import { ComputeOfferingViewModel } from '../../vm/view-models';

@Component({
  selector: 'cs-service-offering-list',
  templateUrl: 'service-offering-list.component.html',
  styleUrls: ['service-offering-list.component.scss'],
})
export class ServiceOfferingListComponent implements OnChanges {
  @Input()
  public offeringList: ComputeOfferingViewModel[];
  @Input()
  public classes: ComputeOfferingClass[];
  @Input()
  public selectedClasses: string[];
  @Input()
  public query: string;
  @Input()
  public selectedOffering: ComputeOfferingViewModel;
  @Input()
  public isLoading = false;
  @Input()
  public showFields: boolean;
  @Input()
  public account: Account;
  @Output()
  public selectedOfferingChange = new EventEmitter<ComputeOfferingViewModel>();

  public list: {
    soClass: ComputeOfferingClass;
    items: MatTableDataSource<ComputeOfferingViewModel>;
  }[];
  public columnsToDisplay = [];

  private mainColumns = ['name', 'cpuCoresNumber', 'cpuSpeed', 'memory', 'networkRate'];
  private allColumns = [
    ...this.mainColumns,
    'diskBytesRead',
    'diskBytesWrite',
    'diskIopsRead',
    'diskIopsWrite',
  ];

  constructor(private dialog: MatDialog, private translateService: TranslateService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.getGroupedOfferings();
    this.onShowFieldsChange(changes.showFields);
  }

  public selectOffering(offering: ComputeOfferingViewModel): void {
    if (offering.iscustomized) {
      this.showCustomOfferingDialog(offering)
        .pipe(filter(Boolean))
        .subscribe(customOffering => {
          this.selectedOffering = customOffering;
          this.selectedOfferingChange.emit(this.selectedOffering);
        });
    } else {
      this.selectedOffering = offering;
      this.selectedOfferingChange.emit(this.selectedOffering);
    }
  }

  public get locale(): Language {
    return this.translateService.currentLang as Language;
  }

  public getDescription(soClass: ComputeOfferingClass) {
    return soClass && soClass.description && soClass.description[this.locale];
  }

  public getName(soClass: ComputeOfferingClass) {
    if (soClass.id === 'common') {
      return 'SERVICE_OFFERING.FILTERS.COMMON';
    }
    return (soClass && soClass.name && soClass.name[this.locale]) || 'empty';
  }

  public getGroupedOfferings() {
    const showClasses = this.classes.filter(
      soClass => this.selectedClasses.indexOf(soClass.id) !== -1,
    );
    if (this.classes.length) {
      this.list = (showClasses.length ? showClasses : this.classes).map(soClass => {
        return {
          soClass,
          items: new MatTableDataSource(this.filterOfferings(this.offeringList, soClass)),
        };
      });
    } else {
      this.list = [{ soClass: null, items: new MatTableDataSource(this.offeringList) }];
    }
  }

  public filterOfferings(list: ComputeOfferingViewModel[], soClass: ComputeOfferingClass) {
    const classesMap = [soClass].reduce((m, i) => ({ ...m, [i.id]: i }), {});
    return list.filter(offering => classesFilter(offering, this.classes, classesMap));
  }

  private onShowFieldsChange(showFields: SimpleChange) {
    const radio = 'radioButton';
    if (!showFields) {
      return;
    }

    this.columnsToDisplay = showFields.currentValue
      ? [...this.allColumns, radio]
      : [...this.mainColumns, radio];
  }

  private showCustomOfferingDialog(
    offering: ServiceOffering,
  ): Observable<ComputeOfferingViewModel> {
    return this.dialog
      .open(CustomServiceOfferingComponent, {
        width: '370px',
        data: {
          offering,
          account: this.account,
        },
      })
      .afterClosed();
  }
}
