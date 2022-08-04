import {ChangeDetectionStrategy, Component, NgModule, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Setting} from '../../setting';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import {ProfileService} from "./profile.service";

const prof = {
  "name": "doudou",
  "email": "aaa@adadadada.dada",
};

@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProfileComponent implements OnInit {

  password = new FormControl('');
  name = new FormControl('');

  user: {};
  profile: {};
  baseUrl = Setting.baseUrl;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private authService: NbAuthService,
    private httpClient: HttpClient,
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
    /* this.profileService.getProfiles().subscribe((res) => {
      console.log("got profiles");
      this.profile = res;
    }); */
    this.getProfile();
  }

  getProfile(): {} {
    this.httpClient.get<any>(this.baseUrl + 'account/' + this.user['sub']).subscribe(
      profile => {
        this.profile = profile;
      },
    );
    return (this.profile) ? this.profile : null;
  }

  updateProfile() {
    console.log('updating profile...');
    this.profile['password'] = this.password.value;
    this.profile['name'] = this.name.value;
    console.log('updated profile: ', this.profile);
/*
    this.httpClient.put<any>(this.baseUrl + '/account/' + this.user['sub'], this.profile).subscribe(
      profile => {
        this.profile = profile;
        console.log('profile: ', this.profile);
      },
    );
    this.getProfile();
    */
  }
}