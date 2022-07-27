import { Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";

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
    this.router.navigate(["/page"]);
  }

  getSessions() {
    this.httpClient.get<any>('http://localhost:5000/all-sessions').subscribe(
      sessions => {
        localStorage.setItem("sessions", JSON.stringify(sessions));
      });
    this.sessions = JSON.parse(localStorage.getItem("sessions"));
    console.log("sessions: ", this.sessions);


  }
}
