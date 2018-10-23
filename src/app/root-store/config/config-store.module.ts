import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducer } from './config.reducer';
import { ConfigEffects } from './config.effects';

@NgModule({
  imports: [StoreModule.forFeature('config', reducer), EffectsModule.forFeature([ConfigEffects])],
})
export class ConfigStoreModule {}
