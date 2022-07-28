import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CommonModule } from '@angular/common';
import { SessionModule } from "./sessions/session.module";
import { SessionInfoModule } from "./session-info/session-info.module";
import { SessionsManModule } from "./sessions-man/sessions-man.module";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    CommonModule,
    SessionModule,
    SessionInfoModule,
    SessionsManModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
