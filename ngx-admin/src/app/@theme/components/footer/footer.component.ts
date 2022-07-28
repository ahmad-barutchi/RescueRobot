import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Created with ♥ by Younes Zahouane and Ahmad Barutchi - 2022.
    </span>
    <div class="socials">
      <a href="https://github.com/ahmad-barutchi/RescueRobot/" target="_blank" class="ion ion-social-github"></a>
      <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-twitter"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
      <a href="https://satav7000.atlassian.net/jira/software/projects/SR/boards/1" target="_blank" class="ion ion-navicon-round ng-star-inserted"></a>
    </div>
  `,
})
export class FooterComponent {
}
