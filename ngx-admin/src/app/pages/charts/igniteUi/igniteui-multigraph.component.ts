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
    // this.reloadComponent();
    this.data = [ this.getTemp(),  this.getTemp2(), this.getHumidity(), this.getFire(), this.getHuman()];
  }
  reloadComponent() {
    this.router.navigate(['/pages/charts/igniteUi'])
      .then(() => {
        window.location.reload();
      });
  }
  public getTemp(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['temp'], high: 268.93, low: 262.80, close: data[x]['temp'], volume: 6118146 };
      this.result.push(this.bean);
    }
    this.res = this.result;
    this.res.title = 'temp';
    return this.result;
  }

  public getTemp2(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['temp2'], high: 268.93, low: 262.80, close: data[x]['temp2'], volume: 6118146 };
      this.result2.push(this.bean);
    }
    this.res = this.result2;
    this.res.title = 'temp2';
    return this.result2;
  }

  public getHumidity(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['humidity'], high: 268.93, low: 262.80, close: data[x]['humidity'], volume: 6118146 };
      this.result3.push(this.bean);
    }
    this.res = this.result3;
    this.res.title = 'Humidity';
    return this.result3;
  }

  public getHuman(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      if (data[x]['human'] === 'y') {
        this.human = 50;
      } else {
        this.human = 10;
      }
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.human, high: 268.93, low: 262.80, close: this.human, volume: 6118146 };
      this.result4.push(this.bean);
    }
    this.res = this.result4;
    this.res.title = 'Human';
    return this.result4;
  }

  public getFire(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      if (data[x]['fire'] === 'y') {
        this.fire = 50;
      } else {
        this.fire = 10;
      }
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.fire, high: 268.93, low: 262.80, close: this.fire, volume: 6118146 };
      this.result5.push(this.bean);
    }
    this.res = this.result5;
    this.res.title = 'Fire';
    return this.result5;
  }

  public getData(): void {
    this.httpClient.get<any>('http://localhost:5000/get-seance/' + this.session).subscribe(
      temps => {
        localStorage.setItem("datas", JSON.stringify(temps));
      });
  }
}
