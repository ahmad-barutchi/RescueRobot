import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import { RobotDataService } from "./RobotDataService";
import { HttpClient } from "@angular/common/http";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.component.html",
})

export class IgniteuiMultigraphComponent {
  public data: any;
  public allData: any;
  public result: Array<any> = [];
  public result2: Array<any> = [];
  public result3: Array<any> = [];
  public result4: Array<any> = [];
  public result5: Array<any> = [];
  public bean: {};
  public bean2: {};
  public bean3: {};
  public bean4: {};
  public bean5: {};
  public res: any;
  public res2: any;
  public res3: any;
  public res4: any;
  public res5: any;
  public human: number;
  public fire: number;
  public max: number;
  constructor(private dataService: RobotDataService, private httpClient: HttpClient) {
    this.data = [ this.getTemp(),  this.getTemp2(), this.getHumidity(), this.getFire(), this.getHuman()];
  }

  public getTemp(): any[] {
    this.httpClient.get<any>('http://localhost:5000/get-seance/seance3').subscribe(
      temps => {
        console.log(temps);
        localStorage.setItem("datas", JSON.stringify(temps));
      });
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['temp'], high: 268.93, low: 262.80, close: data[x]['temp'], volume: 6118146 };
      this.result.push(this.bean);
      console.log('bean : ', this.bean);
    }
    console.log('result: ', this.result);
    this.res = this.result;
    this.res.title = 'temp';
    return this.result;
  }

  public getTemp2(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean2 = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['temp2'], high: 268.93, low: 262.80, close: data[x]['temp2'], volume: 6118146 };
      this.result2.push(this.bean2);
      console.log('bean 2: ', this.bean2);
    }
    console.log('result 2: ', this.result2);
    this.res2 = this.result2;
    this.res2.title = 'temp2';
    return this.result2;
  }

  public getHumidity(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean3 = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['humidity'], high: 268.93, low: 262.80, close: data[x]['humidity'], volume: 6118146 };
      this.result3.push(this.bean3);
      console.log('bean3 : ', this.bean3);
      console.log("minutes", data[x]['minutes'], ",  seconds", data[x]['seconds']);
    }
    console.log('result: ', this.result3);
    this.res3 = this.result3;
    this.res3.title = 'Humidity';
    return this.result3;
  }

  public getHuman(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      if (data[x]['human'] === 'y') {
        this.human = 50;
      } else {
        this.human = 0;
      }
      this.bean4 = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.human, high: 268.93, low: 262.80, close: this.human, volume: 6118146 };
      this.result4.push(this.bean4);
      console.log('bean4 : ', this.bean4);
      console.log("minutes", data[x]['minutes'], ",  seconds", data[x]['seconds']);
    }
    console.log('result: ', this.result4);
    this.res4 = this.result4;
    this.res4.title = 'Human';
    return this.result4;
  }

  public getFire(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      if (data[x]['fire'] === 'y') {
        this.fire = 50;
      } else {
        this.fire = 0;
      }
      this.bean5 = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.fire, high: 268.93, low: 262.80, close: this.fire, volume: 6118146 };
      this.result5.push(this.bean5);
      console.log('bean5 : ', this.bean5);
      console.log("minutes", data[x]['minutes'], ",  seconds", data[x]['seconds']);
    }
    console.log('result: ', this.result5);
    this.res5 = this.result5;
    this.res5.title = 'Fire';
    return this.result5;
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
