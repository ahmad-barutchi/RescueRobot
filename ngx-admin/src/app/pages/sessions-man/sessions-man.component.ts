import {Component, OnInit} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

export class SessionsData {
  name: string;
  start: string;
  end: string;
}

@Component({
  selector: 'ngx-session-man',
  templateUrl: './sessions-man.component.html',
  styleUrls: ['./sessions-man.component.scss'],
})
export class SessionsManComponent implements OnInit {

  public sessions: Array<any> = JSON.parse(localStorage.getItem("sessions_table_info"));
  public date: {} = JSON.parse(localStorage.getItem("date"));
  public items: Array<any> = [];
  public data: Array<SessionsData> = JSON.parse(localStorage.getItem("sessions_table_info"));
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
      end: {
        title: 'Fin',
        type: 'any',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private httpClient: HttpClient, private router: Router) {
    this.source.load(this.data);
  }

  ngOnInit() {
    this.getSessions();
  }

  getSessions() {
    return this.httpClient.get<SessionsData>('http://localhost:5000/all_sessions_table').subscribe(
      temps => {
        localStorage.setItem("sessions_table_info", JSON.stringify(temps));
      });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete ' + event['data']['name'] + '?')) {
      event.confirm.resolve();
      this.httpClient.delete<any>('http://localhost:5000/del-seance/' + event['data']['name']).subscribe(
        temps => {});
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit ' + event['data']['name'] + '\'s name to ' + event['newData']['name'] + '?')) {
      event.confirm.resolve();
      this.httpClient.post<any>('http://localhost:5000/mod-seance/' + event['data']['name'] + '/' + event['newData']['name'], { title: 'Session deleted' }).subscribe(
        temps => {});
    } else {
      event.confirm.reject();
    }
  }
}
