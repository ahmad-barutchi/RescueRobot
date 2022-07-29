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
  public result: Array<any> = [];
  public result2: Array<any> = [];
  public result3: Array<any> = [];
  public result4: Array<any> = [];
  public result5: Array<any> = [];
  public bean: {};
  public res: any;
  public human: number;
  public fire: number;
  public max: number;
  public session: string = "Seance1";
  constructor(private dataService: RobotDataService, private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.session = JSON.parse(localStorage.getItem("session"));
    this.httpClient.get<any>('http://localhost:5000/get-seance/' + this.session).subscribe(
      temps => {
        localStorage.setItem("datas", JSON.stringify(temps));
      });
    this.data = [ this.dataService.getTemp(),  this.dataService.getTemp2(), this.dataService.getHumidity(),
      this.dataService.getFire(), this.dataService.getHuman()];
  }
}
