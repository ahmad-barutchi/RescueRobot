import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {ThemeModule} from '../../@theme/theme.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NbCardModule, NbIconModule, NbButtonModule, NbInputModule, NbSelectModule} from '@nebular/theme';

@NgModule({
  imports: [
    ProfileRoutingModule,
    ThemeModule,
    ReactiveFormsModule,
    FormsModule,
    NbCardModule,
    ThemeModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,

  ],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
