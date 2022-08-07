import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {Setting} from "../../setting";

@Component({
  selector: 'ngx-session',
  styleUrls: ["./session.component.scss"],
  templateUrl: './session.component.html',
})

export class SessionComponent implements OnInit {
  sessions: Array<string> = [];
  user = {};

  constructor(
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  ngOnInit(): void {
    this.getSessions();
  }

  changeSession(session_id: any) {
    localStorage.setItem("session", JSON.stringify(session_id));
    this.httpClient.get<any>(Setting.baseUrl + 'get-seance/' + session_id).subscribe(
      temps => {
        localStorage.setItem("datas", JSON.stringify(temps));
      });
    this.router.navigate(["/pages/session-info"]);
  }

  getSessions() {
    this.httpClient.get<any>(Setting.baseUrl + 'all-sessions').subscribe(
      sessions => {
        localStorage.setItem("sessions", JSON.stringify(sessions));
      });
    this.sessions = JSON.parse(localStorage.getItem("sessions"));
  }
}
