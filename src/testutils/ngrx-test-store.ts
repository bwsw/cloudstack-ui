import { BehaviorSubject, Observable } from 'rxjs';

export class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject<T>(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  // read discussion how to mock pipeable store
  // https://github.com/ngrx/platform/issues/915

  pipe(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}
}
