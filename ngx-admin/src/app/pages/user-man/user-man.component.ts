import { Component } from '@angular/core';
import {LocalDataSource, ServerDataSource} from 'ng2-smart-table';
import {HttpClient} from "@angular/common/http";
import {Setting} from "../../setting";
import {Router} from "@angular/router";

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

  constructor(private httpClient: HttpClient, private router: Router) {
    this.source = new ServerDataSource(this.httpClient, {searchFields: 'temp', endPoint: Setting.baseUrl + 'accounts'});
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete ' + event['data']['email'] + '?')) {
      event.confirm.resolve();
      this.httpClient.delete<any>(Setting.baseUrl + 'del_user/' + event['data']['email']).subscribe(
        res => {});
      this.reloadComponent();
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    if (window.confirm('Are you sure you want to edit ' + event['data']['name'] + '\'s name to ' + event['newData']['name'] + '?')) {
      event.confirm.resolve();
      let url = Setting.baseUrl + 'mod_user/' + event['data']['email'] + '?';
      if (event['data']['name'] !== event['newData']['name']) {
        url += "name=" + event['newData']['name'] + '&';
      }
      if (event['data']['role'] !== event['newData']['role']) {
        url += "role=" + event['newData']['role'] + '&';
      }
      if (event['data']['mdp'] !== event['newData']['mdp']) {
        url += "password=" + event['newData']['mdp'];
      }
      this.httpClient.put<any>(url, { title: 'User Modified' }).subscribe(
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
