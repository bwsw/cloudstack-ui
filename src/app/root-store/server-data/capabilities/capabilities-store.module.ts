import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, capabilitiesFeatureName } from './capabilities.reducers';
import { CapabilitiesEffects } from './capabilities.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(capabilitiesFeatureName, reducer),
    EffectsModule.forFeature([CapabilitiesEffects]),
  ],
})
export class CapabilitiesStoreModule {}
