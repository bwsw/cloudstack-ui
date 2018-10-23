import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';

import { EventService } from './event.service';
import { EventListContainerComponent } from './containers/event-list.container';
import { reducers } from './redux/events.reducers';
import { EventsEffects } from './redux/events.effects';
import { EventListComponent } from './components/event-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    StoreModule.forFeature('events', reducers),
    EffectsModule.forFeature([EventsEffects]),
  ],
  declarations: [EventListContainerComponent, EventListComponent],
  providers: [EventService],
})
export class EventsModule {}
