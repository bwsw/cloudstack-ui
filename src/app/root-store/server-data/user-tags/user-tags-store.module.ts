import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducer } from './user-tags.reducer';
import { UserTagsEffects } from './user-tags.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('userTags', reducer),
    EffectsModule.forFeature([UserTagsEffects]),
  ],
})
export class UserTagsStoreModule {}
