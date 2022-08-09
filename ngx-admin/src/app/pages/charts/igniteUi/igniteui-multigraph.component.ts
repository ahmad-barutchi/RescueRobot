import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { RobotDataService } from "./RobotDataService";
import { HttpClient } from "@angular/common/http";
import {timer} from "rxjs";
import {tap} from "rxjs/operators";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.component.html",
})

export class IgniteuiMultigraphComponent implements OnInit, OnDestroy {
  public data: any = [];
  public records: any;
  public temp_title: any;
  public temp2_title: any;
  public ambTemp_title: any;
  public humidity_title: any;
  public human_title: any;
  public fire_title: any;
  public session: string = JSON.parse(localStorage.getItem("session"));
  tempDisplay: any[] = [];
  temp2Display: any[] = [];
  ambTempDisplay: any[] = [];
  humidityDisplay: any[] = [];
  humanDisplay: any[] = [];
  fireDisplay: any[] = [];
  public human: number;
  public fire: number;
  public brushes: string[];

  call_timer: any;

  constructor(private dataService: RobotDataService, private ref: ChangeDetectorRef) {
    this.brushes = ["Orange", "Black", "Green", "Blue", "Red", "Purple"];
    // this.brushes = ["DarkOrange", "White", " #26c6da", "Blue", "#FF0000", "#32CD32"];
  }

  ngOnInit() {
    this.call_timer = this.interval();
  }

  interval() {
    timer(200)
      .pipe(
        tap(() => {
          this.dataService.getTemps().subscribe(response => {
          this.records = response.map(item => {
          let lat: string = item['pos'];
          let long: string = item['pos'];
          lat = lat.substr(0, 9);
          long = long.substr(10, 16);
          const intLat: number = Number(lat);
          const intLong: number = Number(long);
          if (item['origin'] === "None") {
            this.human = 0;
            this.fire = 0;
          } else if (item['origin'] === "Human") {
            this.human = 50;
            this.fire = 0;
          } else {
            this.human = 0;
            this.fire = 50;
          }
          const temp: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: item['temp'],
            high: intLat,
            low: intLong,
            close: item['temp'],
            volume: 'a',
          };
          const temp2: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: item['temp2'],
            high: intLat,
            low: intLong,
            close: item['temp2'],
            volume: 'a',
          };
          const ambTemp: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: item['ambTemp'],
            high: intLat,
            low: intLong,
            close: item['ambTemp'],
            volume: 'a',
          };
          const humidity: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: item['humidity'],
            high: intLat,
            low: intLong,
            close: item['humidity'],
            volume: 'a',
          };
          const human: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: this.human,
            high: intLat,
            low: intLong,
            close: this.human,
            volume: 'a',
          };
          const fire: any = {
            time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
            open: this.fire,
            high: intLat,
            low: intLong,
            close: this.fire,
            volume: 'a',
          };
          this.tempDisplay.push(temp);
          this.temp2Display.push(temp2);
          this.ambTempDisplay.push(ambTemp);
          this.humidityDisplay.push(humidity);
          this.humanDisplay.push(human);
          this.fireDisplay.push(fire);
        });
        this.temp_title = this.tempDisplay;
        this.temp_title.title = 'temp';
        this.temp2_title = this.temp2Display;
        this.temp2_title.title = 'temp2';
        this.ambTemp_title = this.ambTempDisplay;
        this.ambTemp_title.title = 'ambTemp';
        this.humidity_title = this.humidityDisplay;
        this.humidity_title.title = 'humidity';
        this.human_title = this.humanDisplay;
        this.human_title.title = 'human';
        this.fire_title = this.fireDisplay;
        this.fire_title.title = 'fire';
        this.data = [ this.tempDisplay, this.temp2Display, this.ambTempDisplay, this.humidityDisplay, this.humanDisplay, this.fireDisplay ];
        this.ref.markForCheck();
        });
      })).subscribe();
  }

  ngOnDestroy(): void {
    // clearInterval(this.call_timer);
  }
}
