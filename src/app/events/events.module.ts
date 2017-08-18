import { MdlModule } from '@angular-mdl/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdSelectModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { EventListComponent } from './event-list.component';
import { EventService } from './event.service';
import { EventsRouting } from './events.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdlModule,
    MdSelectModule,
    SharedModule,
    TranslateModule,
    EventsRouting
  ],
  declarations: [EventListComponent],
  providers: [EventService]
})
export class EventsModule { }
