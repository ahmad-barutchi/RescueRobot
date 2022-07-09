import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RobotDataService } from "./RobotDataService";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ RobotDataService ],
  selector: "ngx-app-root",
  styleUrls: ["./ignite.component.scss"],
  templateUrl: "./igniteUi.html",
})
export class IgniteuiMultigraphComponent {
  public data: any;
  constructor(private dataService: RobotDataService) {
    this.data = [ this.dataService.getGoog(), this.dataService.getMsft() ];
  }
}
