import {Component} from '@angular/core';
import {ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Setting} from "../../setting";
import {Router} from "@angular/router";

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
        title: 'Session ID',
        type: 'string',
      },
      session_name: {
        title: 'Session name',
        type: 'string',
      },
      start: {
        title: 'Start',
        type: 'any',
      },
      end: {
        title: 'End',
        type: 'any',
      },
    },
  };
  source: ServerDataSource;

  constructor(private httpClient: HttpClient, private router: Router) {
    this.source = new ServerDataSource(this.httpClient, {endPoint: Setting.baseUrl + 'all_sessions_man'});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete ' + event['data']['name'] + '?')) {
      event.confirm.resolve();
      this.httpClient.delete<any>(Setting.baseUrl + 'del_seance/' + event['data']['name']).subscribe(
        temps => {});
      this.reloadComponent();
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit ' + event['data']['name'] + '?')) {
      event.confirm.resolve();
      console.log(event);
      let url = Setting.baseUrl + 'mod_seance/' + event['data']['name'] + '?';
      if (event['data']['name'] !== event['newData']['name']) {
        url += "name=" + event['newData']['name'] + '&';
      }
      if (event['data']['session_name'] !== event['newData']['session_name']) {
        url += "session_name=" + event['newData']['session_name'];
      }
      this.httpClient.put<any>(url, { title: 'Session Modified' }).subscribe(
        temps => {});
      this.reloadComponent();
    } else {
      event.confirm.reject();
    }
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
