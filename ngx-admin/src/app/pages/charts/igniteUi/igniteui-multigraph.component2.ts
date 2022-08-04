import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import { RobotDataService } from "./RobotDataService";
import { HttpClient } from "@angular/common/http";
import {Router} from "@angular/router";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.component.html",
})

export class IgniteuiMultigraphComponent implements OnInit {
  public data: any;
  public records: Array<any>;
  public session: string = JSON.parse(localStorage.getItem("session"));
  constructor(private dataService: RobotDataService, private httpClient: HttpClient) {}

  ngOnInit() {
    this.data = [ this.dataService.getTemp()];
    // this.records = [];
    /*this.dataService.getTemps().subscribe(response => {
      this.records = response.map(item => {
        console.log(item);
        return item;
      });
    });*/
    // this.dataService.fetchData().subscribe((records) => this.records = records);
  }
}
