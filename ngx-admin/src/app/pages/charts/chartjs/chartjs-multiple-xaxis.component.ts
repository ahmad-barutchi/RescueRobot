import { Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Setting} from '../../../setting';

@Component({
  selector: 'ngx-chartjs-multiple-xaxis',
  template: `
    <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsMultipleXaxisComponent implements OnDestroy {
  baseUrl = Setting.baseUrl;
  data: {};
  options: any;
  themeSubscription: any;
  public temps: Array<string> = [];
  public temps2: Array<string> = [];
  public ambTemp: Array<string> = [];
  public temp: any;
  public session: string = JSON.parse(localStorage.getItem("session"));


  constructor(private theme: NbThemeService,
  private httpClient: HttpClient,
) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      // this.getTemps();
      this.httpClient.get<any>(Setting.baseUrl + 'get_seance/'  + this.session,
        {headers: new HttpHeaders({'Access-Control-Allow-Origin': Setting.baseUrl, 'Access-Control-Allow-Headers': '*'})}).subscribe(
        temps => {
          for (const temp of temps) {
            this.temps.push(temp['temp']);
          }
          for (const temp2 of temps) {
            this.temps2.push(temp2['temp2']);
          }
          for (const ambTemp of temps) {
            this.ambTemp.push(ambTemp['ambTemp']);
          }
          this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              label: 'dataset - big points',
              data: this.temps,
              borderColor: colors.primary,
              backgroundColor: colors.primary,
              fill: false,
              borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            }, {
              label: 'dataset - individual point sizes',
              data: this.temps2,
              borderColor: colors.dangerLight,
              backgroundColor: colors.dangerLight,
              fill: false,
              borderDash: [5, 5],
              pointRadius: 8,
              pointHoverRadius: 10,
            }, {
              label: 'dataset - large pointHoverRadius',
              data: this.ambTemp,
              borderColor: colors.info,
              backgroundColor: colors.info,
              fill: false,
              pointRadius: 8,
              pointHoverRadius: 10,
            }],
          };
        },
      );

      this.options = {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          position: 'bottom',
          labels: {
            fontColor: chartjs.textColor,
          },
        },
        hover: {
          mode: 'index',
        },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Month',
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Value',
              },
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
        },
      };
    });
  }

  getTemps() {
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}
