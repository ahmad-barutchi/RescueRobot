import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, OnDestroy} from "@angular/core";
import { RobotDataService } from "./RobotDataService";
import { HttpClient } from "@angular/common/http";
import {timer} from "rxjs";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.component.html",
})

export class IgniteuiMultigraphComponent implements OnInit, OnDestroy {
  public data: Array<any> = [];
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
  public brushes: Array<any>;

  public series: Array<any> = [];
  call_timer: any;
  private toggle_temp_bool: boolean = true;
  private toggle_temp2_bool: boolean = true;
  private toggle_ambTemp_bool: boolean = true;
  private toggle_humidity_bool: boolean = true;
  private toggle_human_bool: boolean = true;
  private toggle_fire_bool: boolean = true;

  constructor(private dataService: RobotDataService, private ref: ChangeDetectorRef, private router: Router) {
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
                open: item['humanProb'],
                high: intLat,
                low: intLong,
                close: item['humanProb'],
                volume: 'a',
              };
              const fire: any = {
                time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']),
                open: item['fireProb'],
                high: intLat,
                low: intLong,
                close: item['fireProb'],
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
            this.series.push(this.humidityDisplay);
            this.series.push(this.temp2Display);
            this.data = [this.tempDisplay, this.temp2Display, this.ambTempDisplay, this.humidityDisplay, this.humanDisplay, this.fireDisplay ];
            // this.data = this.series;
            this.ref.markForCheck();
          });
        })).subscribe();
  }

  ngOnDestroy(): void {
    // clearInterval(this.call_timer);
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  toggleTempOn() {
    /* console.log(this.data);
    console.log("pushed");
    this.data[5] = this.tempDisplay;
    this.brushes[5] = "Brown";
    console.log(this.data);
    this.ref.markForCheck(); */
    this.reloadComponent();
  }

  toggleTempOFF() {
    if (this.toggle_temp_bool) {
      const index = this.data.findIndex(x => x === this.tempDisplay);
      console.log(index);
      this.data = this.data.filter(item => item !== this.data[0]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[0]);
    }
    this.toggle_temp_bool = false;
    this.ref.markForCheck();
  }

  toggleTemp2OFF() {
    const index = this.data.findIndex(x => x === this.temp2Display);
    console.log(index);
    if (this.toggle_temp2_bool) {
      this.data = this.data.filter(item => item !== this.data[index]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[index]);
    }
    this.toggle_temp2_bool = false;
    this.ref.markForCheck();
  }

  toggleAmbTempOFF() {
    const index = this.data.findIndex(x => x === this.ambTempDisplay);
    console.log(index);
    if (this.toggle_ambTemp_bool) {
      this.data = this.data.filter(item => item !== this.data[index]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[index]);
    }
    this.toggle_ambTemp_bool = false;
    this.ref.markForCheck();
  }

  toggleHumidityOFF() {
    const index = this.data.findIndex(x => x === this.humidityDisplay);
    console.log(index);
    if (this.toggle_humidity_bool) {
      this.data = this.data.filter(item => item !== this.data[index]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[index]);
    }
    this.toggle_humidity_bool = false;
    this.ref.markForCheck();
  }

  toggleHumanOFF() {
    const index = this.data.findIndex(x => x === this.humanDisplay);
    console.log(index);
    if (this.toggle_human_bool) {
      this.data = this.data.filter(item => item !== this.data[index]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[index]);
    }
    this.toggle_human_bool = false;
    this.ref.markForCheck();
  }

  toggleFireOFF() {
    const index = this.data.findIndex(x => x === this.fireDisplay);
    console.log(index);
    if (this.toggle_fire_bool) {
      this.data = this.data.filter(item => item !== this.data[index]);
      this.brushes = this.brushes.filter(item => item !== this.brushes[index]);
    }
    this.toggle_fire_bool = false;
    this.ref.markForCheck();
  }

  render() {
    this.reloadComponent();
  }
}
