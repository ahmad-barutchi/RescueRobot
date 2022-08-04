import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {Setting} from "../../../setting";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class RobotDataService {
  public session: string = JSON.parse(localStorage.getItem("session"));
  public data: any;

  private url = Setting.baseUrl + 'get-seance/Seance1/temp';
  constructor(private httpClient: HttpClient) {}

  public getTemps(): Observable<any[]> {
    const url = Setting.baseUrl + 'get-seance/' + this.session + '/temp';
    return this.httpClient.get<any[]>(url);
  }
  public allData: any;

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

  public fetchData(): Observable<any[]> {
    return this.httpClient.get(this.url).pipe(map(response => response['value']), catchError(
          this.errorHandler('Error loading northwind data', [])));
  }

  private errorHandler<T>(message: string, result: T) {
    return (error: any): Observable<any> => {
      console.error(`${message}: ${error.message}`);
      return of(result as T);
    };
  }

  public getTemp(): any {
    const url = Setting.baseUrl + 'get-seance/' + this.session;
    this.httpClient.get<any[]>(url).subscribe(response => {
      this.data = response.map(item => {
        console.log(item['year']);
        let lat: string = item['pos'];
        let long: string = item['pos'];
        lat = lat.substr(0, 9);
        long = long.substr(10, 16);
        const intLat: number = Number(lat);
        const intLong: number = Number(long);
        this.bean = { time: new Date(item['year'], item['month'], item['date'], item['hour'], item['minutes'], item['seconds']), open: item['temp'], high: intLat, low: intLong, close: 'a', volume: 'a' };
        console.log(this.bean);
        return this.bean;
      });
    });
  }

  public getTemp2(): any[] {
    const data = JSON.parse(localStorage.getItem("datas"));
    this.max = Object.keys(data).length;
    for (let x = 0; x < this.max; x++) {
      let lat: string = data[x]['pos'];
      let long: string = data[x]['pos'];
      lat = lat.substr(0, 9);
      long = long.substr(10, 16);
      const intLat: number = Number(lat);
      const intLong: number = Number(long);
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['temp2'], high: intLat, low: intLong, close: 'a', volume: 'a' };
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
      let lat: string = data[x]['pos'];
      let long: string = data[x]['pos'];
      lat = lat.substr(0, 9);
      long = long.substr(10, 16);
      const intLat: number = Number(lat);
      const intLong: number = Number(long);
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: data[x]['humidity'], high: intLat, low: intLong, close: 'a', volume: 'a' };
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
      let lat: string = data[x]['pos'];
      let long: string = data[x]['pos'];
      lat = lat.substr(0, 9);
      long = long.substr(10, 16);
      const intLat: number = Number(lat);
      const intLong: number = Number(long);
      if (data[x]['human'] === 'y') {
        this.human = 50;
      } else {
        this.human = 10;
      }
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.human, high: intLat, low: intLong, close: 'a', volume: 'a' };
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
      let lat: string = data[x]['pos'];
      let long: string = data[x]['pos'];
      lat = lat.substr(0, 9);
      long = long.substr(10, 16);
      const intLat: number = Number(lat);
      const intLong: number = Number(long);
      if (data[x]['fire'] === 'y') {
        this.fire = 50;
      } else {
        this.fire = 10;
      }
      this.bean = { time: new Date(data[x]['year'], data[x]['month'], data[x]['date'], data[x]['hour'], data[x]['minutes'], data[x]['seconds']), open: this.fire, high: intLat, low: intLong, close: 'a', volume: 'b' };
      this.result5.push(this.bean);
    }
    this.res = this.result5;
    this.res.title = 'Fire';
    return this.result5;
  }
}
