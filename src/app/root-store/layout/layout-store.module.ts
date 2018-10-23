import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { featureStoreName, reducer } from './layout.reducer';

@NgModule({
  imports: [StoreModule.forFeature(featureStoreName, reducer)],
})
export class LayoutStoreModule {}
