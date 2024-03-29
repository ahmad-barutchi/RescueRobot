import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NbAuthJWTToken, NbAuthService} from "@nebular/auth";
import {Setting} from "../../../setting";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: {};
  sessions: Array<string> = [];

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';
  userMenu = [ { title: 'Log out', link: '/auth/login' } ];
  currentSession;

  constructor(private sidebarService: NbSidebarService,
              private authService: NbAuthService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private httpClient: HttpClient,
              private router: Router) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          // here we receive a payload from the token and assigns it to our `user` variable
          this.user = token.getPayload();
          if (this.user['sub'].role === "admin") {
            this.userMenu.push({ title: 'Users administration', link: '/pages/user-man' },
              {title: 'Sessions management', link: '/pages/sessions-man'},
            );
          }
        }});
  }

  getSessions() {
    this.httpClient.get<any>(Setting.baseUrl + 'all_sessions').subscribe(
      sessions => {
        this.sessions = sessions;
      });
  }

  changeSession(session_id: any) {
    localStorage.setItem("session", JSON.stringify(session_id));
    this.reloadComponent();
  }

  reloadComponent() {
    const currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  ngOnInit() {
    this.getSessions();
    const session = JSON.parse(localStorage.getItem("session"));
    this.currentSession = session;
    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
