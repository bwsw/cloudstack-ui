import { Subject } from 'rxjs/Subject';
import { OnDestroy } from '@angular/core';
import { Constructor, SimpleClass } from './contructor';


export const WithUnsubscribe = <TBase extends Constructor<{}>>(Base: TBase = SimpleClass as TBase) => {
  return class extends Base implements OnDestroy {
    protected unsubscribe$ = new Subject<never>();

    public ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  };
};
