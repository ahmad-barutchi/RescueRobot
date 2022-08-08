import { Component } from '@angular/core';
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Setting} from "../../setting";

@Component({
  selector: 'ngx-user-man',
  templateUrl: './user-man.component.html',
  styleUrls: ['./user-man.component.scss'],
})
export class UserManComponent {

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
      email: {
        title: 'Email',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      role: {
        title: 'Role',
        type: 'string',
      },
      mdp: {
        title: 'Password',
        type: 'string',
      },
    },
  };

  public session: string;
  source: ServerDataSource;

  constructor(private httpClient: HttpClient) {
    this.source = new ServerDataSource(this.httpClient, {searchFields: 'temp', endPoint: Setting.baseUrl + 'accounts'});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete ' + event['data']['email'] + '?')) {
      event.confirm.resolve();
      this.httpClient.delete<any>(Setting.baseUrl + 'del_user/' + event['data']['email']).subscribe(
        res => {});
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit ' + event['data']['name'] + '\'s name to ' + event['newData']['name'] + '?')) {
      event.confirm.resolve();
      console.log(event['data']['name']);
      console.log(event['newData']['name']);
      console.log(event);
      let url = Setting.baseUrl + 'mod_user/' + event['data']['email'] + '?';
      if (event['data']['name'] !== ['newData']['name']) {
        url += "name=" + event['newData']['name'] + '&';
      }
      if (event['data']['role'] !== ['newData']['role']) {
        url += "role=" + event['newData']['role'] + '&';
      }
      if (event['data']['password'] !== ['newData']['password']) {
        url += "password=" + event['newData']['password'];
      }
      console.log(url);
      // soit url injection avec des slash, soit par parametre comme /accounts?name_like=momo :)
      // !!!!!! Try http protocole Update instead of post
      this.httpClient.put<any>(url, { title: 'User Modified' }).subscribe(
        temps => {});
    } else {
      event.confirm.reject();
    }
  }
}
