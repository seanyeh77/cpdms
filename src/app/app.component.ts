import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { NavigationSkipped, NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private userSub: Subscription = new Subscription();
  private pageSub: Subscription = new Subscription();
  isAuthenticated = false;
  links = [
    { name: '使用者資料', path: '', needAuth: false },
    { name: '使用者紀錄', path: 'tableUserdata', needAuth: false },
    { name: '打卡紀錄', path: 'userlog', needAuth: true },
    { name: '裝置狀態', path: 'iotstatetable', needAuth: false },
  ];
  activeLink? = this.links[0];
  constructor(private router: Router, private authService: AuthService) {}
  page: string = '';
  isMobile = false;
  ngOnInit(): void {
    this.userSub = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationStart ||
        event instanceof NavigationSkipped
      ) {
        this.page = event.url;
        this.activeLink = this.links.find(
          (link) => link.path === event.url.replace('/', '')
        );
      }
    });
    this.pageSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.isMobile = window.innerWidth < 900;
    window.onresize = () => {
      this.isMobile = window.innerWidth < 900;
    };
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.authService.autoLogin();
  }
  onLogout(): void {
    this.authService.logout();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.pageSub.unsubscribe();
  }
  title = 'UserDatamanager';

  background: ThemePalette = undefined;
}
