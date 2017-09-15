import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export class TableDatabase {
  public dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public get data(): any[] {
    return this.dataChange.value;
  }

  constructor(private list: Array<any>) {
    this.init();
  }

  private init() {
    this.dataChange.next(this.list);
  }
}

export class TableDataSource extends DataSource<any> {
  constructor(private dataBase: TableDatabase) {
    super();
  }

  public connect(): Observable<any[]> {
    return this.dataBase.dataChange;
  }

  public disconnect() {
  }
}
