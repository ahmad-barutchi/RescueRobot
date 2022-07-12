import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import { RobotDataService } from "./RobotDataService";
import { HttpClient } from "@angular/common/http";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.html",
})

export class IgniteuiMultigraphComponent {
  public data: any;
  public allData: any;
  public result: Array<any> = [];
  public bean: {};
  public result2: Array<any> = [];
  public res: any;
  public res2: any;
  public bean2: {};
  public max: number;
  constructor(private dataService: RobotDataService, private httpClient: HttpClient) {
    this.data = [ this.getTemp(),  this.getTemp2()];
  }

  public getTemp(): any[] {
    this.httpClient.get<any>('http://localhost:5000/get-temp').subscribe(
      temps => {
        console.log(temps);
        localStorage.setItem("datas", JSON.stringify(temps));
      });
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date']), open: data[x]['temp'], high: 268.93, low: 262.80, close: data[x]['temp'], volume: 6118146 };
      this.result.push(this.bean);
      console.log('bean : ', this.bean);
    }
    console.log('result: ', this.result);
    this.res = this.result;
    this.res.title = 'temp';
    return this.result;
  }

  public getTemp2(): any[] {
    this.httpClient.get<any>('http://localhost:5000/get-temp').subscribe(
      temps => {
        console.log(temps);
        localStorage.setItem("datas2", JSON.stringify(temps));
      });
    const data = JSON.parse(localStorage.getItem("datas2"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean2 = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date']), open: data[x]['temp2'], high: 268.93, low: 262.80, close: data[x]['temp2'], volume: 6118146 };
      this.result2.push(this.bean2);
      console.log('bean 2: ', this.bean2);
    }
    console.log('result 2: ', this.result2);
    this.res2 = this.result2;
    this.res2.title = 'temp2';
    return this.result2;
  }

  public getTemps() {
    this.httpClient.get<any>('http://localhost:5000/get-temp',
    ).subscribe(
      temps => {
        console.log(temps);
      });
  }

  public getData(): any {
    this.httpClient.get<any>('http://localhost:5000/get-temp',
    ).subscribe(
      temps => {
        console.log(temps);
        this.allData = [ temps ];
        console.log(this.allData);
      });
    return { time: new Date(2013, 1, 1, 5, 13, 59), open: 268.93, high: 268.93, low: 262.80, close: 265.00, volume: 6118146 };
  }
}
