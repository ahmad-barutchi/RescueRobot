import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SessionInfoComponent} from './session-info.component';

const routes: Routes = [
  {
    path: '',
    component: SessionInfoComponent,
    children: [
      {
        path: '',
        component: SessionInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionInfoRoutingModule {
}
