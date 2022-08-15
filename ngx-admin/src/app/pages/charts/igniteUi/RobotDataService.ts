import {Injectable, Input} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {Setting} from "../../../setting";

@Injectable({
  providedIn: 'root',
})
export class RobotDataService {
  public session: string = JSON.parse(localStorage.getItem("session"));
  private url = Setting.baseUrl + 'get_seance/'  + this.session;

  constructor(private httpClient: HttpClient) {}

  public getTemps(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.url);
  }
}
