import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgModule, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Setting} from '../../setting';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {ProfileService} from "./profile.service";
import {Observable, timer} from "rxjs";
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

const prof = {
  "name": "name",
  "email": "email",
};

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProfileComponent implements OnInit, OnDestroy {

  password = new FormControl('');
  name = new FormControl('');

  user: {};
  profile: {} = prof;
  // @Input() profile: Observable<any[]>;
  baseUrl = Setting.baseUrl;
  call_timer: any;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private authService: NbAuthService,
    private httpClient: HttpClient,
    private ref: ChangeDetectorRef,
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          // here we receive a payload from the token and assigns it to our `user` variable
          this.user = token.getPayload();
        }
      });
  }
  ngOnInit(): void {
    /*this.profile = Observable.interval(3000).startWith(0).switchMap(
      () => this.profileService.getProfileByEmail(this.user['sub'].email));
    console.log(this.profileService.getProfileByEmail(this.user['sub'].email));*/
    this.call_timer = this.interval();
    // clearInterval(call_timer);
    /*this.profileService.getProfileByEmail(this.user['sub'].email).subscribe(
      profile => {
        this.profile = profile;
      },
    );*/
  }

  interval() {
    return setInterval(() => {
      this.profileService.getProfileByEmail(this.user['sub'].email).subscribe(
        profile => {
          this.profile = profile;
        },
      );
      // require view to be updated
      this.ref.markForCheck();
    }, 2000);
  }

  updateProfile() {
    this.profile['name'] = this.name.value;
    this.profile['password'] = this.password.value;
    this.profileService.updateProfile(this.user['sub'], this.profile['name'], this.profile['password']);
  }

  ngOnDestroy(): void {
    clearInterval(this.call_timer);
  }
}
