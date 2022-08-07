import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {UserManComponent} from './user-man.component';

const routes: Routes = [
  {
    path: '',
    component: UserManComponent,
    children: [
      {
        path: '',
        component: UserManComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManRoutingModule {
}
