import { NgModule } from '@angular/core';
import { UserManRoutingModule } from './user-man-routing.module';
import { UserManComponent } from './user-man.component';
import {ThemeModule} from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { NbCardModule,  NbButtonModule} from '@nebular/theme';
import {Ng2SmartTableModule} from "ng2-smart-table";

@NgModule({
  imports: [
    CommonModule,
    UserManRoutingModule,
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  declarations: [UserManComponent],
})
export class UserManModule {}
