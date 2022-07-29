import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../@core/data/smart-table';
import {HttpClient} from "@angular/common/http";

export class SessionData {
  date: string;
  pos: string;
  temp: number;
  temp2: number;
  humidity: number;
}

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
      date: {
        title: 'date',
        type: 'any',
      },
      pos: {
        title: 'Position',
        type: 'string',
      },
      temp: {
        title: 'Temperature',
        type: 'string',
      },
      temp2: {
        title: 'Temperature arrière',
        type: 'string',
      },
      humidity: {
        title: 'Humidité',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  public session: string = "Seance1";
  public data: Array<SessionData> = [];
  public bean: {};
  public str: string;
  public date: {} = JSON.parse(localStorage.getItem("date"));
  public max: number;

  constructor(private service: SmartTableData, private httpClient: HttpClient) {
    this.session = JSON.parse(localStorage.getItem("session"));
    this.httpClient.get<any>('http://localhost:5000/get-seance/' + this.session).subscribe(
      temps => {
        localStorage.setItem("datas", JSON.stringify(temps));
      });
    const datas: Array<any> = JSON.parse(localStorage.getItem("datas"));
    console.log('datas', datas);
    this.max = Object.keys(datas).length;
    for (let x = 0; x < this.max; x++) {
      const currentSessionData = new SessionData();
      if (datas[x]['human'] === 'y') {
        currentSessionData.date = (datas[x]['year'] + '-' + datas[x]['month'] + '-' + datas[x]['date'] + ' ' + datas[x]['hour'] + ':' + datas[x]['minutes'] + ':' + datas[x]['seconds']);
        currentSessionData.pos = datas[x]['pos'];
        currentSessionData.temp = datas[x]['temp'];
        currentSessionData.temp2 = datas[x]['temp2'];
        currentSessionData.humidity = datas[x]['humidity'];
        this.data.push(currentSessionData);
      }
      console.log('currentSessionData: ', currentSessionData);
      console.log('this data: ', this.data);
    }
    this.source.load(this.data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
