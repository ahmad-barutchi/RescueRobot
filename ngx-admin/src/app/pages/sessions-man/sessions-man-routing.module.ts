import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SessionsManComponent} from './sessions-man.component';

const routes: Routes = [
  {
    path: '',
    component: SessionsManComponent,
    children: [
      {
        path: '',
        component: SessionsManComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsManRoutingModule {
}
