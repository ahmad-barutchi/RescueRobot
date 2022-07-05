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
  temps: Array<string> = [];

  constructor(private theme: NbThemeService,
  private httpClient: HttpClient,
) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;
      this.getTemps();
      this.data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'dataset - big points',
          data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
          borderColor: colors.primary,
          backgroundColor: colors.primary,
          fill: false,
          borderDash: [5, 5],
          pointRadius: 8,
          pointHoverRadius: 10,
        }, {
          label: 'dataset - individual point sizes',
          data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
          borderColor: colors.dangerLight,
          backgroundColor: colors.dangerLight,
          fill: false,
          borderDash: [5, 5],
          pointRadius: 8,
          pointHoverRadius: 10,
        }, {
          label: 'dataset - large pointHoverRadius',
          data: [this.random(), this.random(), this.random(), this.random(), this.random(), this.random()],
          borderColor: colors.info,
          backgroundColor: colors.info,
          fill: false,
          pointRadius: 8,
          pointHoverRadius: 10,
        }],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
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
    this.httpClient.get<any>('http://localhost:5000/get-temp',
      {headers: new HttpHeaders({'Access-Control-Allow-Origin': 'http://localhost:5000', 'Access-Control-Allow-Headers': '*'})}).subscribe(
      temps => {
        this.temps = temps;
        console.log('all tenants: ', this.temps);
      },
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  private random() {
    return Math.round(Math.random() * 100);
  }
}
