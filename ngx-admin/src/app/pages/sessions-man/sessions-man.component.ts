import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

export class SessionsData {
  name: string;
  start: any;
}

@Component({
  selector: 'ngx-session-man',
  templateUrl: './sessions-man.component.html',
  styleUrls: ['./sessions-man.component.scss'],
})
export class SessionsManComponent implements OnInit {

  public sessions: Array<any> = JSON.parse(localStorage.getItem("sessions"));
  public date: {} = JSON.parse(localStorage.getItem("date"));
  // public datas: Array<any> = JSON.parse(localStorage.getItem("datas"));
  public items: Array<any> = [];
  public data: Array<SessionsData> = [];
  public bean: {};
  public str: string;
  public max: any;

  settings = {
    mode: 'inline',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Séance',
        type: 'string',
      },
      start: {
        title: 'Début',
        type: 'any',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  editConfirm: any;

  constructor(private httpClient: HttpClient, private router: Router) {
    for (const session of this.sessions) {
      const currentTableData = new SessionsData();
      this.httpClient.get<any>('http://localhost:5000/get-seance/' + session).subscribe(
        temps => {
          this.bean = { time: new Date(temps[0]['year'], temps[0]['month'], temps[0]['date'], temps[0]['hour'], temps[0]['minutes'], temps[0]['seconds'])};
          this.str = this.bean['time'].toString();
          this.date = this.str;
          currentTableData.start = this.date;
        });
      currentTableData.name = session;
      this.data.push(currentTableData);
    }
    this.source.load(this.data);
  }

  ngOnInit() {
    this.getSessions();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigate([currentUrl]);
  }

  getSessions() {
    this.httpClient.get<any>('http://localhost:5000/all-sessions').subscribe(
      sessions => {
        localStorage.setItem("sessions", JSON.stringify(sessions));
      });
    this.sessions = JSON.parse(localStorage.getItem("sessions"));
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete ' + event['data']['name'] + '?')) {
      event.confirm.resolve();
      this.httpClient.delete<any>('http://localhost:5000/del-seance/' + event['data']['name']).subscribe(
        temps => {
          this.bean = { time: new Date(temps[0]['year'], temps[0]['month'], temps[0]['date'], temps[0]['hour'], temps[0]['minutes'], temps[0]['seconds'])};
          localStorage.setItem("date", JSON.stringify(this.bean['time']));
        });
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit ' + event['data']['name'] + '\'s name to ' + event['newData']['name'] + '?')) {
      event.confirm.resolve();
      this.httpClient.post<any>('http://localhost:5000/mod-seance/' + event['data']['name'] + '/' + event['newData']['name'], { title: 'Session deleted' }).subscribe(
        temps => {
          this.bean = { time: new Date(temps[0]['year'], temps[0]['month'], temps[0]['date'], temps[0]['hour'], temps[0]['minutes'], temps[0]['seconds'])};
          localStorage.setItem("date", JSON.stringify(this.bean['time']));
        });
    } else {
      event.confirm.reject();
    }
  }
}
