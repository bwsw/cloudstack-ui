import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TableDatabase, TableDataSource } from './table';


@Component({
  selector: 'cs-table',
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnChanges {
  @Input('table-model') public model: any;
  @Input('table-model-selected') public selected: any;
  @Input() public selectable = false;
  @Input() public searchQuery: string;
  @Output() public selectionChange = new EventEmitter();
  public displayedColumns = [];
  public dataSource: TableDataSource | null;
  public database: TableDatabase;

  public meta: any = {
    attributes: []
  };

  public ngOnChanges() {
    this.database = new TableDatabase(this.model.data);
    this.dataSource = new TableDataSource(this.database);
    this.meta.attributes = this.model.columns;

    const cols = [];
    for (let i = 0; i < this.meta.attributes.length; i++) {
      cols.push(this.meta.attributes[i].key);
    }
    this.displayedColumns = cols;

    if (this.selectable) {
      this.displayedColumns.push('select');
    }
  }

  public isAllSelected() {
    return this.model.data.every(data => data.selected);
  }

  public toggleAll() {
    const currentStatus = this.isAllSelected();
    this.model.data.forEach(_ => _.selected = !currentStatus);
    this.updateSelected();
  }

  private updateSelected() {
    this.selected = this.model.data.filter(data => data.selected);
    this.selectionChange.emit({ value: this.selected });
  }

  protected selectionChanged(data) {
    this.updateSelected();
  }
}
