import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TableDatabase, TableDataSource } from './table';


@Component({
  selector: 'cs-table',
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnChanges {
  @Input() public tableModel: any[];
  @Input() public columns: string[];
  @Input() public tableModelSelected: any;
  @Input() public tableId: string;
  @Input() public selectable = false;
  @Input() public searchQuery: string;
  @Output() public selectionChange = new EventEmitter();
  public displayedColumns = [];
  public database = new TableDatabase(this.tableModel);
  public dataSource = new TableDataSource(this.database);

  public ngOnChanges() {
    this.database.update(this.tableModel);

    this.displayedColumns = [...this.columns];

    if (this.selectable) {
      this.displayedColumns.push('select');
    }
  }

  public isAllSelected() {
    return this.tableModel.every(data => data.selected);
  }

  public toggleAll() {
    const currentStatus = this.isAllSelected();
    this.tableModel.forEach(_ => _.selected = !currentStatus);
    this.updateSelected();
  }

  private updateSelected() {
    this.tableModelSelected = this.tableModel.filter(data => data.selected);
    this.selectionChange.emit({ value: this.tableModelSelected });
  }

  protected selectionChanged(data) {
    this.updateSelected();
  }
}
