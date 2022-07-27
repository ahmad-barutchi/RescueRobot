import { NgModule } from '@angular/core';
import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import {ThemeModule} from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { NbCardModule,  NbButtonModule} from '@nebular/theme';

@NgModule({
  imports: [
    CommonModule,
    SessionRoutingModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
  ],
  declarations: [SessionComponent],
})
export class SessionModule {}
