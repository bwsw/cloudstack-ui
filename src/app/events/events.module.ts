import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { EventService } from './event.service';
import { EventListContainerComponent } from './containers/event-list.container';
import { StoreModule } from '@ngrx/store';
import { reducers } from './redux/events.reducers';
import { EventsEffects } from './redux/events.effects';
import { EffectsModule } from '@ngrx/effects';
import { EventListComponent } from './components/event-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    SharedModule,
    TranslateModule,
    StoreModule.forFeature('events', reducers),
    EffectsModule.forFeature([EventsEffects]),

  ],
  declarations: [
    EventListContainerComponent,
    EventListComponent,
  ],
  providers: [
    EventService
  ]
})
export class EventsModule {
}
