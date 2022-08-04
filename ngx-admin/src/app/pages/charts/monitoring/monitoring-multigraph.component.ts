import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FinancialChartType } from "igniteui-angular-charts";
import { FinancialChartVolumeType } from "igniteui-angular-charts";
import { FinancialChartZoomSliderType } from "igniteui-angular-charts";
import { FinancialIndicatorType } from "igniteui-angular-charts";
import { FinancialOverlayType } from "igniteui-angular-charts";
import { IgxFinancialChartComponent } from "igniteui-angular-charts";
import { IgxFinancialIndicatorTypeCollection } from "igniteui-angular-charts";
import { IgxFinancialOverlayTypeCollection } from "igniteui-angular-charts";
import { RobotDataService } from "./RobotDataService";
import {Router} from "@angular/router";


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./monitoring.component.scss"],
  templateUrl: "./monitoring.component.html",
})

export class MonitoringMultigraphComponent implements AfterViewInit, OnInit {
  public data: any[];
  @ViewChild("chart", { static: true })
  public chart: IgxFinancialChartComponent;

  constructor(private dataService: RobotDataService, private router: Router) {
    this.data = this.dataService.GetStockTSLA();
  }

  ngOnInit(): void {
    console.log("monitoring");
    }

  public ngAfterViewInit(): void {

    this.chart.chartType = FinancialChartType.Candle;
    this.chart.zoomSliderType = FinancialChartZoomSliderType.Candle;
    this.chart.volumeType = FinancialChartVolumeType.Area;
    this.chart.indicatorTypes.add(FinancialIndicatorType.ForceIndex);
    this.chart.overlayTypes.add(FinancialOverlayType.PriceChannel);
  }
}
