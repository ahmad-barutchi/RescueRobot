import { NgModule } from '@angular/core';
import { SessionInfoRoutingModule } from './session-info-routing.module';
import { SessionInfoComponent } from './session-info.component';
import {ThemeModule} from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { NbCardModule,  NbButtonModule} from '@nebular/theme';
import {Ng2SmartTableModule} from "ng2-smart-table";

@NgModule({
  imports: [
    CommonModule,
    SessionInfoRoutingModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  declarations: [SessionInfoComponent],
})
export class SessionInfoModule {}
