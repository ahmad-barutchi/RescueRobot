import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Setting} from "../../setting";
import { Profile } from './profile';
import {Observable} from "rxjs";
const prof = {
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

  public getProfileByEmail(email: string): Observable<any[]> {
    return this.httpClient.get<any>(Setting.baseUrl + 'account/' + email);
  }
  public createProfile(customer: Profile) {}

  public updateProfile(email: string, name: string, password: string) {
    this.httpClient.get<any>(Setting.baseUrl + 'account_update/' + email);
  }

  public deleteProfile(id: number) {}
}

