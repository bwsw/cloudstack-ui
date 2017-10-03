import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TableDatabase, TableDataSource } from './table';


@Component({
  selector: 'cs-table',
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnChanges {
  @Input('table-model') public model: any[];
  @Input() public columns: string[];
  @Input('table-model-selected') public selected: any;
  @Input() public tableId: string;
  @Input() public selectable = false;
  @Input() public searchQuery: string;
  @Output() public selectionChange = new EventEmitter();
  public displayedColumns = [];
  public database = new TableDatabase(this.model);
  public dataSource = new TableDataSource(this.database);

  public ngOnChanges() {
    this.database.update(this.model);

    this.displayedColumns = [...this.columns];

    if (this.selectable) {
      this.displayedColumns.push('select');
    }
  }

  public isAllSelected() {
    return this.model.every(data => data.selected);
  }

  public toggleAll() {
    const currentStatus = this.isAllSelected();
    this.model.forEach(_ => _.selected = !currentStatus);
    this.updateSelected();
  }

  private updateSelected() {
    this.selected = this.model.filter(data => data.selected);
    this.selectionChange.emit({ value: this.selected });
  }

  protected selectionChanged(data) {
    this.updateSelected();
  }
}
