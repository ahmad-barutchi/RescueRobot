import { Component } from '@angular/core';
import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Setting} from "../../setting";

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './session-info.component.html',
  styleUrls: ['./session-info.component.scss'],
})
export class SessionInfoComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      origin: {
        title: 'Origin',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'any',
      },
      pos: {
        title: 'Position',
        type: 'string',
      },
      temp: {
        title: 'Front temp',
        type: 'number',
      },
      temp2: {
        title: 'Rear Temp',
        type: 'number',
      },
      ambTemp: {
        title: 'Ambient temp',
        type: 'number',
      },
      humidity: {
        title: 'Humidity',
        type: 'number',
      },
      humanProb: {
        title: 'Human Prob',
        type: 'number',
      },
      fireProb: {
        title: 'Fire Prob',
        type: 'number',
      },
    },
  };

  public session: string;
  public session_name: string;
  source: ServerDataSource;

  constructor(private httpClient: HttpClient) {
    this.session = JSON.parse(localStorage.getItem("session"));
    this.session_name = 'Séance ' + this.session.substring(6);
    this.source = new ServerDataSource(this.httpClient, {searchFields: 'temp', endPoint: Setting.baseUrl + 'session_info/' + this.session});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
