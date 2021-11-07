import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router, private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.isAuth();
  }

  async isAuth() {
    try {
      await this.authService.isAuthenticated();
    } catch (error) {

    }
  }

  async onLogout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/inicio']);
    } catch (error) {
      //toast
    }
    this.router.navigate(['/'])
  }

}
