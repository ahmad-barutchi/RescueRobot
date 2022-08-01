import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Setting} from "../../setting";
import { Profile } from './profile';
let prof = {
  "name": "doudou",
  "email": "aaa@adadadada.dada",
};

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiURL: string = Setting.baseUrl + 'account';
  req: any = null;
  constructor(private httpClient: HttpClient) { }

  public createProfile(customer: Profile) {}

  public updateProfile(customer: Profile) {}

  public deleteProfile(id: number) {}

  public getProfileById(id: number) {}

  public getProfiles() {
    this.req = this.httpClient.get<Profile[]>(`${this.apiURL}accounts`);
    return (this.req) ? this.req : null;
  }

  public getContacts() {
    this.req = this.httpClient.get<Profile[]>(`${this.apiURL}accounts`);
    return (this.req) ? this.req : null;
  }
}

