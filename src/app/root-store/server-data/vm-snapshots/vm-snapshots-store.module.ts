import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, vmSnapshotsFeatureName } from './vm-snapshots.reducer';
import { VmSnapshotsEffects } from './vm-snapshots.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(vmSnapshotsFeatureName, reducer),
    EffectsModule.forFeature([VmSnapshotsEffects]),
  ],
})
export class VmSnapshotsStoreModule {}
