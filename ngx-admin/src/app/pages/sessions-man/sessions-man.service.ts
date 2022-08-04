import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionsMan} from "./sessions-man";
import {Setting} from "../../setting";

@Injectable({
  providedIn: 'root',
})
export class SessionsManService {

  constructor(private http: HttpClient) { }
  public getSessionMan(): Observable<SessionsMan[]> {
    const url = Setting.baseUrl + 'all_sessions_man';
    localStorage.setItem("sessions_table_info", JSON.stringify(this.http.get<SessionsMan[]>(url)));
    return this.http.get<SessionsMan[]>(url);
  }
}
