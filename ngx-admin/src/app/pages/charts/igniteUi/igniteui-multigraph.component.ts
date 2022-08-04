import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from "@angular/core";
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
  public data: any[] = [];
  public records: any;
  public temp_title: any;
  public temp2_title: any;
  public humidity_title: any;
  public human_title: any;
  public fire_title: any;
  public session: string = JSON.parse(localStorage.getItem("session"));
  tempDisplay: any[] = [];
  temp2Display: any[] = [];
  humidityDisplay: any[] = [];
  humanDisplay: any[] = [];
  fireDisplay: any[] = [];
  public human: number;
  public fire: number;

  constructor(private dataService: RobotDataService, private httpClient: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    // this.records = [];
    this.dataService.getTemps().subscribe(response => {
      console.log("Respo: ", response);
      this.records = response.map(item => {
        let lat: string = item['pos'];
        let long: string = item['pos'];
        lat = lat.substr(0, 9);
        long = long.substr(10, 16);
        const intLat: number = Number(lat);
        const intLong: number = Number(long);
        if (item['human'] === 'y') {
          this.human = 50;
        } else {
          this.human = 0;
        }
        const temp: any = {
          time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
          open: item['temp'],
          high: intLat,
          low: intLong,
          close: 'a',
          volume: 'a',
        };
        const temp2: any = {
          time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
          open: item['temp2'],
          high: intLat,
          low: intLong,
          close: 'a',
          volume: 'a',
        };
        const humidity: any = {
          time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
          open: item['humidity'],
          high: intLat,
          low: intLong,
          close: 'a',
          volume: 'a',
        };
        const human: any = {
          time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
          open: this.human,
          high: intLat,
          low: intLong,
          close: 'a',
          volume: 'a',
        };
        const fire: any = {
          time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
          open: this.fire,
          high: intLat,
          low: intLong,
          close: 'a',
          volume: 'a',
        };
        this.tempDisplay.push(temp);
        this.temp2Display.push(temp2);
        this.humidityDisplay.push(humidity);
        this.humanDisplay.push(human);
        this.fireDisplay.push(fire);
      });
      this.temp_title = this.tempDisplay;
      this.temp_title.title = 'temp';
      this.temp2_title = this.temp2Display;
      this.temp2_title.title = 'temp2';
      this.humidity_title = this.humidityDisplay;
      this.humidity_title.title = 'humidity';
      this.human_title = this.humanDisplay;
      this.human_title.title = 'human';
      this.fire_title = this.fireDisplay;
      this.fire_title.title = 'fire';
      this.data = [ this.tempDisplay, this.temp2Display, this.humidityDisplay, this.fireDisplay, this.humanDisplay ];
    });
    // this.data = [ this.tempDisplay ];

  }
}
