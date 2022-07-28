import { NgModule } from '@angular/core';
import { SessionsManRoutingModule } from './sessions-man-routing.module';
import { SessionsManComponent } from './sessions-man.component';
import {ThemeModule} from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { NbCardModule,  NbButtonModule} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  imports: [
    CommonModule,
    SessionsManRoutingModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  declarations: [SessionsManComponent],
})
export class SessionsManModule {}
