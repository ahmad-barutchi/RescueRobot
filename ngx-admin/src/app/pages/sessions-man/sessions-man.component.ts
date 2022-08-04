import {Component} from '@angular/core';
import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Setting} from "../../setting";

@Component({
  selector: 'ngx-session-man',
  templateUrl: './sessions-man.component.html',
  styleUrls: ['./sessions-man.component.scss'],
})
export class SessionsManComponent {

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
  source: ServerDataSource;

  constructor(private httpClient: HttpClient) {
    this.source = new ServerDataSource(this.httpClient, {endPoint: Setting.baseUrl + 'all_sessions_man'});
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
