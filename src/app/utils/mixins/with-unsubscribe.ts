import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Constructor, SimpleClass } from './contructor';

// tslint:disable:variable-name
export const WithUnsubscribe = <TBase extends Constructor<{}>>(
  Base: TBase = SimpleClass as TBase,
) => {
  return class extends Base implements OnDestroy {
    protected unsubscribe$ = new Subject<never>();

    public ngOnDestroy(): void {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
    }
  };
};
